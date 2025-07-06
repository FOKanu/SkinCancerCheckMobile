# Model Inference API

This is a containerized FastAPI application for model inference using PyTorch. The application provides a REST API endpoint for making predictions on image inputs.

## Setup

1. Build the Docker image:
```bash
docker build -t model-inference-api .
```

2. Run the container:
```bash
docker run -p 8000:8000 model-inference-api
```

## API Endpoints

### GET /
Health check endpoint that returns a simple message indicating the API is running.

### POST /predict
Endpoint for making predictions on images.

**Request:**
- Method: POST
- Content-Type: multipart/form-data
- Body: image file

**Response:**
```json
{
    "predicted_class": 0,
    "confidence": 0.95,
    "status": "success"
}
```

## Development

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application locally:
```bash
uvicorn app.main:app --reload
```

## Notes

- The current implementation includes a mixed model using mobilenet with default weights and an additional layer for the prediction. The model is bundled with this package. This might need revision at a later stage.
- The API is configured to run on port 8000 by default. 
- For convenience, there is a make file to build, run, etc. the containerized application.