#!/bin/bash

# Replace 'your_image.jpg' with the path to your image file
IMAGE_PATH="your_image.jpg"

# API endpoint with port 4000
API_URL="http://localhost:4000/predict"

# Send the POST request with the image file
curl -v -X POST \
  -F "file=@${IMAGE_PATH}" \
  "${API_URL}"
