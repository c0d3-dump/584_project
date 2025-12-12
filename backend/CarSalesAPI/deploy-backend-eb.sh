#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy-backend-eb.sh <app-name> <env-name> [region]
APP_NAME=${1:-car-sales-backend}
ENV_NAME=${2:-car-sales-env}
REGION=${3:-us-east-1}

# Ensure dotnet publish
dotnet restore
dotnet publish -c Release -o ./publish

# Package
cd publish
zip -r ../backend-deploy.zip *
cd ..

# Ensure AWS CLI & EB CLI installed
if ! command -v aws >/dev/null 2>&1 || ! command -v eb >/dev/null 2>&1; then
  echo "Please install AWS CLI and Elastic Beanstalk CLI and re-run this script."
  exit 1
fi

# Use Docker platform for .NET 9 to avoid platform incompatibilities
if [ ! -f ".elasticbeanstalk/config.yml" ]; then
  eb init -p docker ${APP_NAME} --region ${REGION} || true
fi

# Create environment if it doesn't exist
if ! eb status ${ENV_NAME} >/dev/null 2>&1; then
  eb create ${ENV_NAME} --single --platform docker --region ${REGION}
fi

# Deploy
eb deploy ${ENV_NAME}

# Clean up package
rm backend-deploy.zip

# Show URL
eb open ${ENV_NAME}
