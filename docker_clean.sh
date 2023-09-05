#!/bin/bash

docker container rm transcendance-frontend-1
docker container rm transcendance-backend-1
docker container rm transcendance-db-1

docker image rm -f $(docker image ls -aq)

docker network rm -f transcendance_client-side transcendance_server-side

docker volume rm -f transcendance_db-data

echo ""

docker container ls -a
docker image ls -a
docker network ls
docker volume ls


