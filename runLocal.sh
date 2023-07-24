#!/bin/bash

docker compose -p eda_local -f docker-compose.yml -f docker-compose.dev.yml down -v

mkdir -p /tmp/edaBinaryFiles
mkdir -p /tmp/download

docker compose -p eda_local -f docker-compose.yml -f docker-compose.dev.yml up
