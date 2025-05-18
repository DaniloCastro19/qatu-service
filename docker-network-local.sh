#!/bin/bash

FRONTEND_IMAGE="qatu-client"
BACKEND_IMAGE="qatu-service"
MONGO_IMAGE="mongo:8.0"

NETWORK="qatu-network"

docker network create -d bridge $NETWORK || true

docker build -t qatu-client ./../qatu-client
docker build -t qatu-service .
docker pull $MONGO_IMAGE

docker volume create mongo-data

docker run -d --name qatu-mongo --net=$NETWORK -p 27017:27017 -v mongo-data:/data/db $MONGO_IMAGE

docker run -d --name qatu-service --net=$NETWORK --link qatu-mongo -e CONNECTION_STRING="mongodb://qatu-mongo:27017/" --env-file .env $BACKEND_IMAGE

docker run -d --name qatu-client -p 5173:5173 --net=$NETWORK --link qatu-service $FRONTEND_IMAGE