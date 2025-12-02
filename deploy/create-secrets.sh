#!/bin/bash

# Create AWS Secrets Manager secrets
# Usage: ./create-secrets.sh

set -e

AWS_REGION=${AWS_REGION:-us-east-1}

echo "Creating AWS Secrets Manager secrets..."

# RDS Credentials
echo "Creating RDS credentials secret..."
aws secretsmanager create-secret \
  --name rds/credentials \
  --description "RDS database credentials" \
  --secret-string '{"username":"postgres","password":"CHANGE_ME"}' \
  --region $AWS_REGION \
  2>/dev/null || echo "Secret rds/credentials already exists or error occurred"

# JWT Secret
echo "Creating JWT secret..."
aws secretsmanager create-secret \
  --name app/jwt-secret \
  --description "JWT signing secret" \
  --secret-string "CHANGE_ME-your-256-bit-secret-key-for-jwt-token-generation-must-be-at-least-32-characters-long" \
  --region $AWS_REGION \
  2>/dev/null || echo "Secret app/jwt-secret already exists or error occurred"

# AWS Credentials
echo "Creating AWS credentials secret..."
aws secretsmanager create-secret \
  --name aws/credentials \
  --description "AWS access credentials for S3" \
  --secret-string '{"access-key-id":"CHANGE_ME","secret-access-key":"CHANGE_ME"}' \
  --region $AWS_REGION \
  2>/dev/null || echo "Secret aws/credentials already exists or error occurred"

echo "✅ Secrets created. Please update the values using AWS Console or CLI:"
echo "   aws secretsmanager put-secret-value --secret-id <secret-id> --secret-string '<json>'"

