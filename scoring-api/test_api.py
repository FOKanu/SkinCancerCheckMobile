import requests
import os

def test_api():
    """Test the API endpoints"""
    base_url = "http://localhost:4000"

    # Test root endpoint
    try:
        response = requests.get(f"{base_url}/")
        print(f"Root endpoint response: {response.json()}")
    except Exception as e:
        print(f"Error testing root endpoint: {e}")
        return False

    # Test prediction endpoint with a sample image
    try:
        # Use a test image if available
        test_image_path = "../test_image.jpg"
        if os.path.exists(test_image_path):
            with open(test_image_path, 'rb') as f:
                files = {'file': f}
                response = requests.post(f"{base_url}/predict", files=files)
                print(f"Prediction response: {response.json()}")
        else:
            print("No test image found, skipping prediction test")
    except Exception as e:
        print(f"Error testing prediction endpoint: {e}")
        return False

    return True

if __name__ == "__main__":
    test_api()
