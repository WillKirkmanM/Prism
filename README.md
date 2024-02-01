# Prism | The End-To-End Encrypted Message Relay


## Get Started
### With Docker
```
$ docker-compose up
```

#### In the background (as a daemon)
```
$ docker-compose up -d 
```

### Without Docker
#### NextJS Frontend
```
npm install
```
```
npm run dev
```
#### Golang Backend
```
$ cd backend
```
```
$ go mod download
```
```
$ go run main.go
```
#### Redis Database
Unless a Redis server running locally, we recommend a docker container to run the Redis server.
```
$ docker run -d --name redis-stack-server -p 6379:6379 redis/redis-stack-server:latest
```

After this, head to http://localhost:3000 to see the app running.

## For Developers
### With Docker
If you would like to test your changes with docker, make sure to re-build the image
```
$ docker-compose up --build
```
### Monitoring Redis 
To make sure that you can connect to the Redis database and see the changes, we recommend the use of RedisInsight. You can download it [here](https://redislabs.com/redis-enterprise/redis-insight/).