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

	app.Post("/encrypt", encrypt)
	app.Post("/decrypt", decrypt)

	app.Listen(":3001")
}