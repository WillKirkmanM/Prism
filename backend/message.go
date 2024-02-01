package main

import (
	"context"
	"time"

	"github.com/google/uuid"
	"github.com/redis/rueidis"
	"github.com/redis/rueidis/om"
	"github.com/gofiber/fiber/v2"
)

type Message struct {
	Key  							string    `json:"key" redis:",key"` 
	UUID 							string		`json:"uuid" redis:",uuid"`
	Ver  							int64     `json:"ver" redis:",ver"` 
	EncryptedMessage 	string    `json:"encryptedMessage"`
	CreatedAt        	time.Time `json:"createdAt"`
}

func createMessage(c *fiber.Ctx) error {
	client, err := connect()
	if err != nil {
			return err
	}

	defer client.Close()
	
	var body RequestBody
	err = c.BodyParser(&body)
	if err != nil {
		return err
	}
	encryptedMessage := body.Message

	if encryptedMessage == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Missing encryptedMessage header"})
	}

	messageRepository := om.NewJSONRepository("message", Message{}, client).(*om.JSONRepository[Message])
	createIndex(c.Context(), messageRepository)

	msg := messageRepository.NewEntity()

	msg.EncryptedMessage = encryptedMessage
	msg.CreatedAt = time.Now()
	msg.UUID = uuid.NewString()

	err = messageRepository.Save(c.Context(), msg)
	if err != nil {
		return err
	}

	return c.JSON(msg)
}

func createIndex(ctx context.Context, repo *om.JSONRepository[Message]) {
	repo.CreateIndex(ctx, func(schema om.FtCreateSchema) rueidis.Completed {
		return schema.FieldName("$.uuid").As("uuid").Tag().Build()
	})
}

func searchMessage(c *fiber.Ctx) error {
	client, err := connect()
	if err != nil {
		return err
	}
	defer client.Close()
	repo := om.NewJSONRepository("message", Message{}, client).(*om.JSONRepository[Message])

	uuid := c.Get("uuid") 

	_, records, _ := repo.Search(c.Context(), func(search om.FtSearchIndex) rueidis.Completed {
    return search.Query("@uuid:{$v}").Params().Nargs(2).NameValue().NameValue("v", uuid).Dialect(2).Build()
	})

	if len(records) > 0 {
		return c.JSON(records[0])
	}

	return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "No message found with the provided uuid"})
}