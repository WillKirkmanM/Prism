package main

import (
	"crypto/aes"
	"crypto/cipher"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"

	"github.com/gofiber/fiber/v2"
)

// Shared key for encryption and decryption
var key = generateKey()

func generateKey() []byte {
	// Generate a new 32-byte key
	key := make([]byte, 32)
	if _, err := rand.Read(key); err != nil {
		panic(fmt.Sprintf("error generating key: %v", err))
	}
	return key
}

func encrypt(c *fiber.Ctx) error {
	stringToEncrypt := c.Get("message")

	plaintext := []byte(stringToEncrypt)

	block, err := aes.NewCipher(key)
	if err != nil {
		return fmt.Errorf("error creating cipher: %v", err)
	}

	ciphertext := make([]byte, aes.BlockSize+len(plaintext))
	iv := ciphertext[:aes.BlockSize]
	if _, err := io.ReadFull(rand.Reader, iv); err != nil {
		return fmt.Errorf("error generating IV: %v", err)
	}

	stream := cipher.NewCFBEncrypter(block, iv)
	stream.XORKeyStream(ciphertext[aes.BlockSize:], plaintext)

	return c.SendString(hex.EncodeToString(ciphertext))
}

func decrypt(c *fiber.Ctx) error {
	encryptedString := c.Get("message")

	ciphertext, _ := hex.DecodeString(encryptedString)

	block, err := aes.NewCipher(key)
	if err != nil {
		return fmt.Errorf("error creating cipher: %v", err)
	}

	if len(ciphertext) < aes.BlockSize {
		return fmt.Errorf("ciphertext too short")
	}
	iv := ciphertext[:aes.BlockSize]
	ciphertext = ciphertext[aes.BlockSize:]

	stream := cipher.NewCFBDecrypter(block, iv)
	stream.XORKeyStream(ciphertext, ciphertext)

	return c.SendString(string(ciphertext))
}