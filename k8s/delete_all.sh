#!/usr/bin/env bash

# delete ingress 
printf "\n==> Deleting ingress\n"
kubectl delete -f ingress.yml

# delete users container
printf "\n==> Deleting Users API deployment and service\n"
kubectl delete -f users-api.yml

# delete mysql container
printf "\n==> Deleting MySQL deployment and service\n"
kubectl delete -f mysql.yml

# delete namespace
printf "\n==> Deleting DEV namespace\n"
kubectl delete namespace tfm-dev-amartinm82