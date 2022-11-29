#!/bin/bash

docker compose -f docker-compose.yml -f docker-compose.dev.yml down -v

mkdir -p /tmp/edaBinaryFiles
mkdir -p /tmp/download

docker compose -f docker-compose.yml -f docker-compose.dev.yml up
