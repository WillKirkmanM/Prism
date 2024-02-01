package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	app := fiber.New()

	app.Use(LocalhostOnly)

	app.Use(cors.New(cors.Config{
		// AllowOrigins: "http://127.0.0.1:3000",
		AllowOrigins: "*",
		AllowHeaders: "Origin, Content-Type, Accept, uuid",
		AllowMethods: "GET,POST",
	}))

	app.Use(recover.New())

	app.Post("/encrypt", encrypt)
	app.Post("/decrypt", decrypt)
	app.Post("/messages/add", createMessage)
	app.Get("/messages/get", searchMessage)

	app.Listen(":3001")
}