#!/bin/bash

AKS_RESOURCE_GROUP=RESOURCE_GROUP_NAME
AKS_CLUSTER_NAME=CLUSTER_NAME
ACR_RESOURCE_GROUP=RESOURCE_GROUP_NAME
ACR_NAME=REGISTRY_NAME

# Get the id of the service principal configured for AKS
CLIENT_ID=$(az aks show --resource-group $AKS_RESOURCE_GROUP --name $AKS_CLUSTER_NAME --query "servicePrincipalProfile.clientId" --output tsv)

# Get the ACR registry resource id
ACR_ID=$(az acr show --name $ACR_NAME --resource-group $ACR_RESOURCE_GROUP --query "id" --output tsv)

# Create role assignment
az role assignment create --assignee $CLIENT_ID --role Reader --scope $ACR_ID