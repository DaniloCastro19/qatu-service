#!/bin/bash

FRONTEND_IMAGE="registry.gitlab.com/jala-university1/cohort-2/oficial-es-desarrollo-de-software-4-cssd-245.ga.t1.25.m2/secci-n-a/union-sveltica/qatu-client:latest"
BACKEND_IMAGE="registry.gitlab.com/jala-university1/cohort-2/oficial-es-desarrollo-de-software-4-cssd-245.ga.t1.25.m2/secci-n-a/union-sveltica/qatu-service:latest"
MONGO_IMAGE="mongo:8.0"

NETWORK="qatu-network"

docker network create -d bridge $NETWORK || true

docker pull $FRONTEND_IMAGE
docker pull $BACKEND_IMAGE
docker pull $MONGO_IMAGE

docker volume create mongo-data

docker run -d --name qatu-mongo --net=$NETWORK -p 27017:27017 -v mongo-data:/data/db $MONGO_IMAGE

docker run -d --name qatu-service --net=$NETWORK --link qatu-mongo -e CONNECTION_STRING="mongodb://qatu-mongo:27017/" --env-file $QATU_ENV $BACKEND_IMAGE

docker run -d --name qatu-client -p 5173:5173 --net=$NETWORK --link qatu-service $FRONTEND_IMAGE