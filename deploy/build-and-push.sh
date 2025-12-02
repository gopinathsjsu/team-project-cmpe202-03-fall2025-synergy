#!/bin/bash

# Build and Push Docker Images to ECR
# Usage: ./build-and-push.sh [backend|frontend|embeddings|all]

set -e

AWS_REGION=${AWS_REGION:-us-east-1}
AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID:-""}

if [ -z "$AWS_ACCOUNT_ID" ]; then
    echo "Error: AWS_ACCOUNT_ID environment variable not set"
    echo "Usage: AWS_ACCOUNT_ID=123456789 ./build-and-push.sh [service]"
    exit 1
fi

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY

build_and_push() {
    local SERVICE=$1
    local DOCKERFILE_PATH=$2
    local CONTEXT_PATH=$3
    
    echo "Building $SERVICE..."
    docker build -t $SERVICE:latest -f $DOCKERFILE_PATH $CONTEXT_PATH
    
    echo "Tagging $SERVICE..."
    docker tag $SERVICE:latest $ECR_REGISTRY/campus-marketplace-$SERVICE:latest
    
    echo "Pushing $SERVICE to ECR..."
    docker push $ECR_REGISTRY/campus-marketplace-$SERVICE:latest
    
    echo "✅ $SERVICE pushed successfully"
}

SERVICE=${1:-all}

case $SERVICE in
    backend)
        build_and_push "backend" "backend/Dockerfile" "backend"
        ;;
    frontend)
        build_and_push "frontend" "frontend/Dockerfile" "frontend"
        ;;
    embeddings)
        build_and_push "embeddings" "embeddings-service/Dockerfile" "embeddings-service"
        ;;
    all)
        build_and_push "backend" "backend/Dockerfile" "backend"
        build_and_push "frontend" "frontend/Dockerfile" "frontend"
        build_and_push "embeddings" "embeddings-service/Dockerfile" "embeddings-service"
        ;;
    *)
        echo "Usage: $0 [backend|frontend|embeddings|all]"
        exit 1
        ;;
esac

echo "🎉 All images pushed successfully!"

