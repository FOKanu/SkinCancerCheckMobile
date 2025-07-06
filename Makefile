.PHONY: help build run stop clean logs test

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

build: ## Build the ML scoring API Docker image
	docker-compose build

run: ## Start the ML scoring API service
	docker-compose up -d

stop: ## Stop the ML scoring API service
	docker-compose down

clean: ## Remove all containers and images
	docker-compose down --rmi all --volumes --remove-orphans

logs: ## Show logs from the ML service
	docker-compose logs -f scoring-api

test: ## Test the ML API endpoint
	curl -X GET http://localhost:4000/

test-predict: ## Test the prediction endpoint (requires an image file)
	@echo "Testing prediction endpoint..."
	@echo "Usage: make test-predict IMAGE=path/to/image.jpg"
	@if [ -z "$(IMAGE)" ]; then \
		echo "Please provide an image file: make test-predict IMAGE=path/to/image.jpg"; \
		exit 1; \
	fi
	curl -X POST http://localhost:4000/predict \
		-F "file=@$(IMAGE)" \
		-H "Content-Type: multipart/form-data"

start-app: ## Start the React Native app
	npx expo start

dev: ## Start both ML service and React Native app
	make run
	sleep 5
	make start-app
