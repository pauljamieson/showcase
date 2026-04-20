#!/bin/bash

read -p "(d)ev or (p)rod deployment": deployment
if ! [[ $deployment =~ [DdPp] ]]; then
  echo Enter p or d only.
  exit 1
fi
read -p "Enter backup file name: " filename


if [[ $deployment =~ [Dd] ]]; then
  docker compose -f docker-compose-dev.yml stop
  docker run --rm -v $(pwd):/backup -v showcase_pgdata:/var/lib/postgresql/data ubuntu tar xvf /backup/$filename 
  docker compose -f docker-compose-dev.yml start 
fi
if [[ $deployment =~ [Pp] ]]; then
  docker compose stop
  docker run --rm -v $(pwd):/backup -v showcase_prod_pgdata:/var/lib/postgresql/data ubuntu tar xvf /backup/$filename 
  docker compose start 
fi