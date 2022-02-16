#!/usr/bin/env bash

# delete users container
printf "\n==> Deleting Users API deployment and service\n"
kubectl delete -f users-api.yml

# delete mysql container
printf "\n==> Deleting MySQL deployment, service and persistent volume claim\n"
kubectl delete -f mysql.yml

# delete secrets
printf "\n==> Deleting secrets\n"
kubectl delete -f secrets.yml

# delete namespace
printf "\n==> Deleting DEV namespace\n"
kubectl delete namespace tfm-dev-amartinm82