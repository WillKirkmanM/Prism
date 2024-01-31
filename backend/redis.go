package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/redis/rueidis"
	"github.com/redis/rueidis/om"
	"time"
)

type Message struct {
	Key  string    `json:"key" redis:",key"` 
	Ver  int64     `json:"ver" redis:",ver"` 
	EncryptedMessage string    `json:"encryptedMessage"`
	CreatedAt        time.Time `json:"createdAt"`
}

func createMessage(ctx *fiber.Ctx) error {
	client, err := rueidis.NewClient(rueidis.ClientOption{InitAddress: []string{"127.0.0.1:6379"}})
	if err != nil {
		return err
	}
	defer client.Close()

	encryptedMessage := ctx.Get("message")

	if encryptedMessage == "" {
		return ctx.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing encryptedMessage header"})
	}

	messageRepository := om.NewJSONRepository("message", Message{}, client)

	msg := messageRepository.NewEntity()
	msg.EncryptedMessage = encryptedMessage
	msg.CreatedAt = time.Now()

	err = messageRepository.Save(ctx.Context(), msg)
	if err != nil {
		return err
	}

	return ctx.JSON(msg)
}