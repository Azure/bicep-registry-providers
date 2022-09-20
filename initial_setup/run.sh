#!/bin/bash

# This script creates the necessary registry infrastructure and configures GitHub OpenID Connect to allow
# GitHub actions to push to the registry in its CD pipeline.
# 
# Usage (replace <tenantId> & <subId> with the correct values for the registry):
#   ./run.sh <tenantId> <subId>

tenantId=$1
subId=$2
registryName=bicepproviderregistry
registryLocation=centralus
rgName=bicep-registry-providers
repoName=bicep-registry-providers
repoSubject=repo:Azure/$repoName:ref:refs/heads/main

az group create \
  --location $registryLocation
  --name $rgName
az deployment group create \
  --resource-group $rgName \
  --template-file ./acr.bicep \
  --parameters \
    registryName=$registryName \
    registryLocation=$registryLocation

appCreate=$(az ad app create --display-name $registryName)
appId=$(echo $appCreate | jq -r '.appId')
appOid=$(echo $appCreate | jq -r '.id')

spCreate=$(az ad sp create --id $appId)
spId=$(echo $spCreate | jq -r '.id')
az role assignment create --role contributor --subscription $subId --assignee-object-id $spId --assignee-principal-type ServicePrincipal --scope /subscriptions/$subId/resourceGroups/ant-test

az rest --method POST --uri "https://graph.microsoft.com/beta/applications/$appOid/federatedIdentityCredentials" --body '{"name":"'$repoName'","issuer":"https://token.actions.githubusercontent.com","subject":"'$repoSubject'","description":"GitHub OIDC Connection","audiences":["api://AzureADTokenExchange"]}'

echo "Now configure the following GitHub Actions secrets:"
echo "  ACR_CLIENT_ID: $appId"
echo "  ACR_SUBSCRIPTION_ID: $subId"
echo "  ACR_TENANT_ID: $tenantId"