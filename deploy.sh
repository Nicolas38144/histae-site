#!/bin/bash

set -euo pipefail

# Configuration
IMAGE_NAME="histae-site"
CONTAINER_NAME="histae-site-container"
PORT=8080

echo "=== Deploying the application ==="
# Check for build
if [ ! -d "dist" ]; then
  echo "Error: 'dist' folder not found. Please run 'npm run build' first."
  exit 1
fi
echo "'dist' folder found."
echo

# Stop and remove existing container
if sudo docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
  echo "=== Stopping and removing existing container ==="
  sudo docker rm -f "$CONTAINER_NAME" || true
  echo
fi

# Remove existing Docker image
if sudo docker images -q "$IMAGE_NAME" >/dev/null; then
  echo "=== Removing existing Docker image ==="
  sudo docker rmi -f "$IMAGE_NAME" || true
  echo
fi

# Build the new Docker image
echo "=== Building Docker image ==="
sudo docker build -t "$IMAGE_NAME" .
echo

# Start the new container
echo "=== Starting new container ==="
sudo docker run -d \
  --name "$CONTAINER_NAME" \
  -p "$PORT:80" \
  "$IMAGE_NAME"
echo

echo "=== Deployment completed ==="
echo "App is available at: http://localhost:$PORT"