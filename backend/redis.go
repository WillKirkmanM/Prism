package main

import (
	"github.com/redis/rueidis"
)
func connect() (rueidis.Client, error) {
	client, err := rueidis.NewClient(rueidis.ClientOption{InitAddress: []string{"redis:6379"}})
	if err != nil {
		return nil, err
	}
	return client, nil
}