#!/bin/bash

# Docker build and push script for marvinpedia
# Usage: ./build-and-push.sh [tag]
# Default tag: latest

set -e

# Configuration
REGISTRY="192.168.178.29:5000"
IMAGE_NAME="marvinpedia"
TAG=${1:-latest}
FULL_IMAGE_NAME="${REGISTRY}/${IMAGE_NAME}:${TAG}"

echo "🏗️  Building and pushing Docker image to registry..."
echo "Registry: ${REGISTRY}"
echo "Image: ${FULL_IMAGE_NAME}"
echo ""

# Build the Docker image
echo "📦 Building Docker image..."
docker build -t "${FULL_IMAGE_NAME}" .

# Push the image to registry
echo "📤 Pushing image to registry..."
docker push "${FULL_IMAGE_NAME}"

echo ""
echo "✅ Success! Image pushed to: ${FULL_IMAGE_NAME}"
echo ""
echo "To pull and run on another machine:"
echo "docker pull ${FULL_IMAGE_NAME}"
echo "docker run -p 8080:80 ${FULL_IMAGE_NAME}"