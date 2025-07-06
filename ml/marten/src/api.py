from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
from typing import Dict, Any

from .model import SkinLesionModel
from .utils import load_image, preprocess_image, postprocess_prediction

app = FastAPI(
    title="Skin Cancer Check API",
    description="API for skin lesion classification using deep learning",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize model
model = SkinLesionModel()
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "model.h5")

# Load model if it exists
if os.path.exists(MODEL_PATH):
    model.load_model(MODEL_PATH)
else:
    print(f"Warning: Model not found at {MODEL_PATH}")

@app.get("/")
async def root() -> Dict[str, str]:
    """Root endpoint to check if API is running."""
    return {"message": "Skin Cancer Check API is running"}

@app.get("/health")
async def health_check() -> Dict[str, str]:
    """Health check endpoint."""
    if model.model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    return {"status": "healthy", "model_loaded": True}

@app.post("/predict")
async def predict(file: UploadFile = File(...)) -> Dict[str, Any]:
    """
    Predict endpoint for skin lesion classification.

    Args:
        file: Uploaded image file

    Returns:
        Dictionary containing prediction results
    """
    if model.model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")

    try:
        # Read image
        contents = await file.read()
        image = load_image(contents)

        # Preprocess image
        processed_image = preprocess_image(image)

        # Make prediction
        prediction = model.predict(processed_image)

        # Postprocess prediction
        result = postprocess_prediction(prediction[0])

        return result

    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing image: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
