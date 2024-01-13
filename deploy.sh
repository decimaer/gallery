#!/bin/sh
docker compose -f docker-compose.prod-build.yml build &&
docker push hampushampus/gallery:main-backend &&
docker push hampushampus/gallery:file-server &&
docker push hampushampus/gallery:frontend