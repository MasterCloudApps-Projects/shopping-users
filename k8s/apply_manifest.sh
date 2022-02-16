#!/usr/bin/env bash

# Create namespace
printf "\n==> Creating DEV namespace\n"
kubectl create namespace tfm-dev-amartinm82

# create secrets
printf "\n==> Creating secrets\n"
kubectl apply -f secrets.yml

# start mysql container
printf "\n==> Starting MySQL deployment, service and persistent volume claim\n"
kubectl apply -f mysql.yml

# start users container
printf "\n==> Starting Users API deployment and service\n"
kubectl apply -f users-api.yml