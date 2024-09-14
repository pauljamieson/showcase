#!/bin/bash

read -p "Enter backup file name: " filename
read -p "Enter name of volume to restore to: " volname


docker compose -f docker-compose-dev.yml stop
docker run --rm -v $(pwd):/backup -v $volname:/var/lib/postgresql/data ubuntu tar xvf /backup/$filename 
docker compose -f docker-compose-dev.yml start 
