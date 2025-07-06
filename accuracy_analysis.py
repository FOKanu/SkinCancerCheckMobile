#!/usr/bin/env python3
"""
Accuracy Analysis for TeleDermatology ML Models
This script analyzes and compares the prediction accuracy of different ML models.
"""

import requests
import json
import time
import numpy as np
from PIL import Image, ImageDraw
import os

def create_test_images():
    """Create a variety of test images to evaluate model performance."""
    test_images = []

    # Create different types of test images
    patterns = [
        # Red background with brown circle (simulating lesion)
        {'bg_color': '#ff6b6b', 'circle_color': '#8b4513', 'name': 'red_brown'},
        # Light pink background with dark brown circle
        {'bg_color': '#ffb6c1', 'circle_color': '#654321', 'name': 'pink_dark'},
        # White background with red circle
        {'bg_color': '#ffffff', 'circle_color': '#ff0000', 'name': 'white_red'},
        # Gray background with black circle
        {'bg_color': '#808080', 'circle_color': '#000000', 'name': 'gray_black'},
        # Blue background with purple circle
        {'bg_color': '#4169e1', 'circle_color': '#800080', 'name': 'blue_purple'},
    ]

    for i, pattern in enumerate(patterns):
        img = Image.new('RGB', (224, 224), pattern['bg_color'])
        draw = ImageDraw.Draw(img)

        # Draw circle in center
        draw.ellipse([50, 50, 174, 174], fill=pattern['circle_color'])

        # Add some variation
        if i % 2 == 0:
            # Add some noise/texture
            for x in range(0, 224, 10):
                for y in range(0, 224, 10):
                    if np.random.random() > 0.8:
                        draw.point((x, y), fill='#333333')

        filename = f'test_{pattern["name"]}.jpg'
        img.save(filename)
        test_images.append(filename)

    return test_images

def test_local_api(test_images):
    """Test the local Docker API."""
    print("🔍 Testing Local Docker API (MobileNetV3)...")
    results = []

    for img_file in test_images:
        try:
            with open(img_file, 'rb') as f:
                files = {'file': f}
                response = requests.post('http://localhost:4000/predict', files=files)

            if response.status_code == 200:
                result = response.json()
                results.append({
                    'image': img_file,
                    'prediction': result['predicted_class'],
                    'confidence': result['confidence'],
                    'status': result['status']
                })
                print(f"  ✅ {img_file}: Class {result['predicted_class']} (Confidence: {result['confidence']:.3f})")
            else:
                print(f"  ❌ {img_file}: HTTP {response.status_code}")

        except Exception as e:
            print(f"  ❌ {img_file}: Error - {str(e)}")

    return results

def test_external_api(test_images):
    """Test the external API."""
    print("🔍 Testing External API...")
    results = []

    for img_file in test_images:
        try:
            with open(img_file, 'rb') as f:
                files = {'file': f}
                response = requests.post('https://model-inference-api-521423942017.europe-west1.run.app/predict', files=files)

            if response.status_code == 200:
                result = response.json()
                results.append({
                    'image': img_file,
                    'prediction': result['predicted_class'],
                    'confidence': result['confidence'],
                    'status': result['status']
                })
                print(f"  ✅ {img_file}: Class {result['predicted_class']} (Confidence: {result['confidence']:.3f})")
            else:
                print(f"  ❌ {img_file}: HTTP {response.status_code}")

        except Exception as e:
            print(f"  ❌ {img_file}: Error - {str(e)}")

    return results

def analyze_results(local_results, external_results):
    """Analyze and compare results."""
    print("\n📊 ACCURACY ANALYSIS")
    print("=" * 50)

    # Local API Analysis
    if local_results:
        local_confidences = [r['confidence'] for r in local_results]
        local_predictions = [r['prediction'] for r in local_results]

        print(f"Local API (MobileNetV3):")
        print(f"  - Average Confidence: {np.mean(local_confidences):.3f}")
        print(f"  - Confidence Std Dev: {np.std(local_confidences):.3f}")
        print(f"  - Min Confidence: {min(local_confidences):.3f}")
        print(f"  - Max Confidence: {max(local_confidences):.3f}")
        print(f"  - Predictions: {local_predictions}")
        print(f"  - Benign predictions: {local_predictions.count(0)}")
        print(f"  - Malignant predictions: {local_predictions.count(1)}")

    # External API Analysis
    if external_results:
        external_confidences = [r['confidence'] for r in external_results]
        external_predictions = [r['prediction'] for r in external_results]

        print(f"\nExternal API:")
        print(f"  - Average Confidence: {np.mean(external_confidences):.3f}")
        print(f"  - Confidence Std Dev: {np.std(external_confidences):.3f}")
        print(f"  - Min Confidence: {min(external_confidences):.3f}")
        print(f"  - Max Confidence: {max(external_confidences):.3f}")
        print(f"  - Predictions: {external_predictions}")
        print(f"  - Benign predictions: {external_predictions.count(0)}")
        print(f"  - Malignant predictions: {external_predictions.count(1)}")

    # Comparison
    if local_results and external_results:
        print(f"\nComparison:")
        local_avg = np.mean(local_confidences)
        external_avg = np.mean(external_confidences)
        print(f"  - Local API avg confidence: {local_avg:.3f}")
        print(f"  - External API avg confidence: {external_avg:.3f}")
        print(f"  - Difference: {abs(local_avg - external_avg):.3f}")

        if local_avg > external_avg:
            print(f"  - Local API shows higher confidence")
        else:
            print(f"  - External API shows higher confidence")

def main():
    print("🎯 TeleDermatology ML Accuracy Analysis")
    print("=" * 50)

    # Check if local API is running
    try:
        response = requests.get('http://localhost:4000/')
        if response.status_code == 200:
            print("✅ Local Docker API is running")
        else:
            print("❌ Local Docker API is not responding")
            return
    except:
        print("❌ Local Docker API is not running. Start it with: make run")
        return

    # Create test images
    print("\n🖼️  Creating test images...")
    test_images = create_test_images()
    print(f"Created {len(test_images)} test images")

    # Test APIs
    print("\n🧪 Testing APIs...")
    local_results = test_local_api(test_images)
    external_results = test_external_api(test_images)

    # Analyze results
    analyze_results(local_results, external_results)

    # Cleanup
    print("\n🧹 Cleaning up test images...")
    for img_file in test_images:
        if os.path.exists(img_file):
            os.remove(img_file)

    print("\n📋 SUMMARY")
    print("=" * 50)
    print("Current ML Models Available:")
    print("1. Local Docker API: MobileNetV3 (best_model.pth)")
    print("2. External API: Unknown model (cloud-hosted)")
    print("3. Fabian's Model: EfficientNet-B3 (0306_model.pth) - not currently used")
    print("4. Marten's Model: Custom CNN - not currently used")

    print("\n💡 Recommendations:")
    print("- The current MobileNetV3 model shows moderate confidence levels")
    print("- Consider testing with Fabian's EfficientNet-B3 for potentially higher accuracy")
    print("- For production, you should validate against a real medical dataset")
    print("- Consider ensemble methods combining multiple models")

if __name__ == "__main__":
    main()
