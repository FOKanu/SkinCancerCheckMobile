import numpy as np
from PIL import Image
import io
from typing import Tuple, Union

def load_image(image_data: Union[str, bytes, io.BytesIO]) -> Image.Image:
    """
    Load an image from various input types.

    Args:
        image_data: Can be a file path (str), bytes, or BytesIO object

    Returns:
        PIL Image object
    """
    if isinstance(image_data, str):
        return Image.open(image_data)
    elif isinstance(image_data, bytes):
        return Image.open(io.BytesIO(image_data))
    elif isinstance(image_data, io.BytesIO):
        return Image.open(image_data)
    else:
        raise ValueError("Unsupported image data type")

def preprocess_image(
    image: Image.Image,
    target_size: Tuple[int, int] = (224, 224),
    normalize: bool = True
) -> np.ndarray:
    """
    Preprocess an image for model input.

    Args:
        image: PIL Image object
        target_size: Target size for resizing (height, width)
        normalize: Whether to normalize pixel values to [0, 1]

    Returns:
        Preprocessed image as numpy array
    """
    # Convert to RGB if needed
    if image.mode != 'RGB':
        image = image.convert('RGB')

    # Resize image
    image = image.resize(target_size, Image.Resampling.LANCZOS)

    # Convert to numpy array
    img_array = np.array(image)

    # Normalize if requested
    if normalize:
        img_array = img_array.astype(np.float32) / 255.0

    return img_array

def postprocess_prediction(
    prediction: np.ndarray,
    class_labels: list = ["benign", "malignant"]
) -> dict:
    """
    Convert model prediction to human-readable format.

    Args:
        prediction: Raw model prediction array
        class_labels: List of class labels

    Returns:
        Dictionary with prediction results
    """
    # Get class with highest probability
    predicted_class_idx = np.argmax(prediction)
    confidence = float(prediction[predicted_class_idx])

    # Create result dictionary
    result = {
        "prediction": class_labels[predicted_class_idx],
        "confidence": confidence,
        "class_probabilities": {
            label: float(prob) for label, prob in zip(class_labels, prediction)
        }
    }

    return result
