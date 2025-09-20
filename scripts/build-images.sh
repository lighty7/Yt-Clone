#!/bin/bash

# Build script for YouTube Clone Docker images
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGISTRY=${REGISTRY:-"your-registry.com"}
TAG=${TAG:-"latest"}
PUSH=${PUSH:-false}

echo -e "${GREEN}🐳 Building YouTube Clone Docker Images${NC}"
echo "Registry: $REGISTRY"
echo "Tag: $TAG"
echo "Push: $PUSH"
echo ""

# Function to build and optionally push image
build_image() {
    local context=$1
    local dockerfile=$2
    local image_name=$3
    local target=${4:-""}
    
    echo -e "${YELLOW}Building $image_name...${NC}"
    
    if [ -n "$target" ]; then
        docker build -f "$dockerfile" -t "$REGISTRY/$image_name:$TAG" --target "$target" "$context"
    else
        docker build -f "$dockerfile" -t "$REGISTRY/$image_name:$TAG" "$context"
    fi
    
    if [ "$PUSH" = "true" ]; then
        echo -e "${YELLOW}Pushing $image_name...${NC}"
        docker push "$REGISTRY/$image_name:$TAG"
    fi
    
    echo -e "${GREEN}✅ $image_name built successfully${NC}"
    echo ""
}

# Build backend image
build_image "./backend" "Dockerfile" "yt-clone-backend" "final"

# Build frontend image
build_image "./frontend" "Dockerfile" "yt-clone-frontend" "final"

# Build development images
echo -e "${YELLOW}Building development images...${NC}"
build_image "./backend" "Dockerfile" "yt-clone-backend-dev" "development"
build_image "./frontend" "Dockerfile" "yt-clone-frontend-dev" "development"

echo -e "${GREEN}🎉 All images built successfully!${NC}"

# List built images
echo -e "${YELLOW}📋 Built images:${NC}"
docker images | grep yt-clone

# Usage instructions
echo ""
echo -e "${YELLOW}📖 Usage:${NC}"
echo "  # Run locally with docker-compose"
echo "  docker-compose up -d"
echo ""
echo "  # Deploy to Kubernetes"
echo "  kubectl apply -f k8s/"
echo ""
echo "  # Deploy with Helm"
echo "  helm install yt-clone ./helm/yt-clone"
echo ""
echo "  # Push images to registry"
echo "  PUSH=true ./scripts/build-images.sh"
