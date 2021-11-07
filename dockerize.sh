#!/usr/bin/env bash

if [ -z "$1" ]
  then
    echo "No version supplied"
    exit 1
fi

if [[ -z "${DOCKERHUB_NAME}" ]]; then
  echo "DOCKERHUB_NAME environment variable is not defined"
  exit 1
fi

DOCKERHUB_NAME="${DOCKERHUB_NAME}"
SERVER_IMAGE_NAME="${DOCKERHUB_NAME}/tfm-users"

# Compile and publish Server
printf "\n==> Compile and public app image with name '%s', using Dockerfile\n" ${SERVER_IMAGE_NAME}
docker build -t "${SERVER_IMAGE_NAME}:"$1 -t "${SERVER_IMAGE_NAME}:latest" .
docker push --all-tags ${SERVER_IMAGE_NAME}

exit 0