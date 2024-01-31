package main

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/recover"
)

func main() {
	app := fiber.New()

	app.Use(LocalhostOnly)

	app.Use(cors.New())

	app.Use(recover.New())

	app.Get("/encrypt", encrypt)
	app.Get("/decrypt", decrypt)
	app.Get("/messages/add", createMessage)

	app.Listen(":3001")
}