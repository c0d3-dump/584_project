#!/usr/bin/env bash
set -euo pipefail

# Usage: ./deploy-frontend-s3.sh <s3-bucket> [region]
BUCKET=${1}
REGION=${2:-us-east-1}

if [ -z "$BUCKET" ]; then
  echo "Usage: $0 <bucket-name> [region]"
  exit 1
fi

# Build production
npm install
npm run build --silent

DIST_DIR=dist/car-sales-frontend

if [ ! -d "$DIST_DIR" ]; then
  echo "Build failed; dist directory not found: $DIST_DIR"
  exit 1
fi

# Sync to S3
aws s3 sync $DIST_DIR s3://$BUCKET --acl public-read --delete

# Optionally, invalidate CloudFront distribution
# aws cloudfront create-invalidation --distribution-id <id> --paths "/*"

echo "Deployed to https://$BUCKET.s3.amazonaws.com/"
