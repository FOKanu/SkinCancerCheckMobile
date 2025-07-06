# Variables
IMAGE_NAME = model-inference-api
CONTAINER_NAME = model-inference-api-container
PORT = 8000

.PHONY: build run stop clean

# Build the Docker image

build:
	docker build -t $(IMAGE_NAME) .

# For building with Google Cloud Build and pushing to Artifact Registry
# docker build --platform linux/amd64 -t $GCP_REGION-docker.pkg.dev/$GCP_PROJECT_ID/$DOCKER_REPO_NAME/$DOCKER_IMAGE_NAME:0.1 .

# Run the containerized application
run:
	docker run -d \
		--name $(CONTAINER_NAME) \
		-p $(PORT):8000 \
		$(IMAGE_NAME)

# Stop and remove the container
stop:
	docker stop $(CONTAINER_NAME) || true
	docker rm $(CONTAINER_NAME) || true

# Clean up the Docker image
clean: stop
	docker rmi $(IMAGE_NAME) || true

# Build and run in one command
up: build run

# Show logs
logs:
	docker logs -f $(CONTAINER_NAME)

# Help command
help:
	@echo "Available commands:"
	@echo "  make build    - Build the Docker image"
	@echo "  make run      - Run the containerized application"
	@echo "  make stop     - Stop and remove the container"
	@echo "  make clean    - Remove the container and image"
	@echo "  make up       - Build and run in one command"
	@echo "  make logs     - Show container logs"
	@echo "  make help     - Show this help message"
