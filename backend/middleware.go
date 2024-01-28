package main

import (
	"github.com/gofiber/fiber/v2"
)

func LocalhostOnly(c *fiber.Ctx) error {
	if c.IP() != "127.0.0.1" {
		return fiber.ErrForbidden
	}
	return c.Next()
}
