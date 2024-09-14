#!/bin/bash

read -p "Enter backup file name: " filename
read -p "Enter name of showcase database container: " contname

docker compose -f docker-compose-dev.yml stop
docker run --rm --volumes-from $contname -v $(pwd):/backup ubuntu tar cvf /backup/$filename /var/lib/postgresql/data
docker compose -f docker-compose-dev.yml start 
