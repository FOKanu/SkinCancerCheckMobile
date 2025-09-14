# ML Integration Guide

This document explains how to use the integrated ML models for skin lesion analysis.

## Overview

The app now includes:
- **FastAPI scoring service** with MobileNetV3 model
- **Multiple ML models** from different team members
- **Docker containerization** for easy deployment
- **React Native integration** for mobile app

## Quick Start

### 1. Start the ML Service

```bash
# Build and start the ML scoring API
make build
make run

# Or use docker-compose directly
docker-compose up -d
```

### 2. Test the ML Service

```bash
# Test the health endpoint
make test

# Test prediction with an image
make test-predict IMAGE=path/to/your/image.jpg
```

### 3. Start the React Native App

```bash
# Start the mobile app
make start-app

# Or start both services together
make dev
```

## Architecture

### ML Models Available

1. **MobileNetV3** (scoring-api/app/models/best_model.pth)
   - Lightweight model for mobile deployment
   - 2-class classification (benign/malignant)
   - Optimized for speed and efficiency

2. **EfficientNet-B3** (ml/fabian/0306_model.pth)
   - Higher accuracy model
   - Enhanced architecture with dropout layers
   - Better for server-side processing

### API Endpoints

- `GET /` - Health check
- `POST /predict` - Skin lesion prediction
  - Input: Image file (multipart/form-data)
  - Output: JSON with prediction and confidence

### Response Format

```json
{
  "predicted_class": 0,  // 0=benign, 1=malignant
  "confidence": 0.95,
  "status": "success"
}
```

## Development

### Adding New Models

1. Place your model file in `scoring-api/app/models/`
2. Update `app/main.py` to load your model
3. Modify the prediction logic if needed
4. Rebuild the Docker image: `make build`

### Switching Models

To use a different model:

1. Replace `best_model.pth` with your model file
2. Update the model loading code in `app/main.py`
3. Ensure the model architecture matches the loading code
4. Rebuild and restart: `make build && make run`

### Local Development

```bash
# Run ML service locally (without Docker)
cd scoring-api
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 4000

# Run React Native app
npx expo start
```

## Troubleshooting

### Common Issues

1. **Port 4000 already in use**
   ```bash
   # Find and kill the process
   lsof -ti:4000 | xargs kill -9
   ```

2. **Docker build fails**
   ```bash
   # Clean and rebuild
   make clean
   make build
   ```

3. **Model loading errors**
   - Check model file path in `app/main.py`
   - Ensure model architecture matches the code
   - Verify PyTorch version compatibility

### Logs

```bash
# View ML service logs
make logs

# View Docker logs
docker-compose logs scoring-api
```

## Performance

### Model Performance

- **MobileNetV3**: ~50ms inference time
- **EfficientNet-B3**: ~100ms inference time
- **Memory usage**: ~200MB per container

### Optimization Tips

1. Use GPU if available (modify Dockerfile)
2. Enable model quantization for smaller models
3. Use batch processing for multiple images
4. Implement caching for repeated predictions

## Security

- API runs on localhost:4000
- No authentication required for local development
- Add authentication for production deployment
- Consider rate limiting for production use

## Production Deployment

For production deployment:

1. Add authentication to the API
2. Use HTTPS
3. Implement rate limiting
4. Add monitoring and logging
5. Use a production-grade server (Gunicorn)
6. Set up proper environment variables
