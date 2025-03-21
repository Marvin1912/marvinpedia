#!/bin/bash

set -e

./gradlew clean build

IMAGE_NAME=k8s
IMAGE_TAG=latest
REGISTRY=192.168.178.29:5000

echo "Building Docker image: $REGISTRY/$IMAGE_NAME:$IMAGE_TAG..."
docker build -t "$REGISTRY/$IMAGE_NAME:$IMAGE_TAG" .

echo "Pushing Docker image to $REGISTRY..."
docker push "$REGISTRY/$IMAGE_NAME:$IMAGE_TAG"

echo "Docker image $REGISTRY/$IMAGE_NAME:$IMAGE_TAG successfully pushed!"
