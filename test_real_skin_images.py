#!/usr/bin/env python3
"""
Real Skin Images Prediction Test
This script tests the prediction service with real skin lesion images from the archive.
"""

import requests
import json
import time
import numpy as np
import os
import glob
from PIL import Image
import matplotlib.pyplot as plt
from collections import defaultdict

# Configuration
SKIN_IMAGES_PATH = "/Users/francis/Downloads/Skin images archive"
API_URL = "http://localhost:4000/predict"
TEST_SAMPLES_PER_CLASS = 25  # Number of images to test from each class

def get_test_images():
    """Get a sample of test images from each class."""
    test_images = []

    # Get benign images from test folder
    benign_path = os.path.join(SKIN_IMAGES_PATH, "data/test/benign")
    benign_images = glob.glob(os.path.join(benign_path, "*.jpg"))
    benign_sample = np.random.choice(benign_images, min(TEST_SAMPLES_PER_CLASS, len(benign_images)), replace=False)

    for img_path in benign_sample:
        test_images.append({
            'path': img_path,
            'true_label': 0,  # Benign
            'filename': os.path.basename(img_path)
        })

    # Get malignant images from test folder
    malignant_path = os.path.join(SKIN_IMAGES_PATH, "data/test/malignant")
    malignant_images = glob.glob(os.path.join(malignant_path, "*.jpg"))
    malignant_sample = np.random.choice(malignant_images, min(TEST_SAMPLES_PER_CLASS, len(malignant_images)), replace=False)

    for img_path in malignant_sample:
        test_images.append({
            'path': img_path,
            'true_label': 1,  # Malignant
            'filename': os.path.basename(img_path)
        })

    return test_images

def test_prediction_service(test_images):
    """Test the prediction service with real skin images."""
    print("🔍 Testing Prediction Service with Real Skin Images...")
    results = []

    for i, img_info in enumerate(test_images):
        try:
            print(f"  Testing {i+1}/{len(test_images)}: {img_info['filename']} (True: {'Malignant' if img_info['true_label'] == 1 else 'Benign'})")

            with open(img_info['path'], 'rb') as f:
                files = {'file': f}
                response = requests.post(API_URL, files=files, timeout=30)

            if response.status_code == 200:
                result = response.json()
                prediction_result = {
                    'filename': img_info['filename'],
                    'true_label': img_info['true_label'],
                    'predicted_class': result['predicted_class'],
                    'confidence': result['confidence'],
                    'correct': result['predicted_class'] == img_info['true_label'],
                    'status': result['status']
                }
                results.append(prediction_result)

                status_icon = "✅" if prediction_result['correct'] else "❌"
                print(f"    {status_icon} Predicted: {'Malignant' if result['predicted_class'] == 1 else 'Benign'} (Confidence: {result['confidence']:.3f})")
            else:
                print(f"    ❌ HTTP {response.status_code}: {response.text}")

        except Exception as e:
            print(f"    ❌ Error: {str(e)}")

    return results

def analyze_results(results):
    """Analyze prediction results and calculate accuracy metrics."""
    print("\n📊 PREDICTION ACCURACY ANALYSIS")
    print("=" * 60)

    if not results:
        print("❌ No results to analyze")
        return

    # Basic statistics
    total_images = len(results)
    correct_predictions = sum(1 for r in results if r['correct'])
    accuracy = correct_predictions / total_images

    print(f"📈 Overall Accuracy: {accuracy:.3f} ({correct_predictions}/{total_images})")
    print(f"📈 Overall Accuracy: {accuracy*100:.1f}%")

    # Confidence analysis
    confidences = [r['confidence'] for r in results]
    print(f"📊 Average Confidence: {np.mean(confidences):.3f}")
    print(f"📊 Confidence Range: {min(confidences):.3f} - {max(confidences):.3f}")
    print(f"📊 Confidence Std Dev: {np.std(confidences):.3f}")

    # Per-class analysis
    benign_results = [r for r in results if r['true_label'] == 0]
    malignant_results = [r for r in results if r['true_label'] == 1]

    print(f"\n🎯 Per-Class Analysis:")
    print(f"  Benign Images: {len(benign_results)}")
    if benign_results:
        benign_accuracy = sum(1 for r in benign_results if r['correct']) / len(benign_results)
        benign_confidences = [r['confidence'] for r in benign_results]
        print(f"    - Accuracy: {benign_accuracy:.3f} ({benign_accuracy*100:.1f}%)")
        print(f"    - Avg Confidence: {np.mean(benign_confidences):.3f}")

    print(f"  Malignant Images: {len(malignant_results)}")
    if malignant_results:
        malignant_accuracy = sum(1 for r in malignant_results if r['correct']) / len(malignant_results)
        malignant_confidences = [r['confidence'] for r in malignant_results]
        print(f"    - Accuracy: {malignant_accuracy:.3f} ({malignant_accuracy*100:.1f}%)")
        print(f"    - Avg Confidence: {np.mean(malignant_confidences):.3f}")

    # Confusion matrix
    print(f"\n📋 Confusion Matrix:")
    tp = sum(1 for r in malignant_results if r['correct'])  # True Positives (correctly predicted malignant)
    tn = sum(1 for r in benign_results if r['correct'])      # True Negatives (correctly predicted benign)
    fp = sum(1 for r in benign_results if not r['correct'])  # False Positives (benign predicted as malignant)
    fn = sum(1 for r in malignant_results if not r['correct'])  # False Negatives (malignant predicted as benign)

    print(f"                    Predicted")
    print(f"                   Benign  Malignant")
    print(f"  Actual Benign     {tn:6d}  {fp:9d}")
    print(f"  Actual Malignant  {fn:6d}  {tp:9d}")

    # Calculate metrics
    if tp + fn > 0:
        sensitivity = tp / (tp + fn)  # True Positive Rate / Recall
        print(f"  Sensitivity (TPR): {sensitivity:.3f} ({sensitivity*100:.1f}%)")

    if tn + fp > 0:
        specificity = tn / (tn + fp)  # True Negative Rate
        print(f"  Specificity (TNR): {specificity:.3f} ({specificity*100:.1f}%)")

    if tp + fp > 0:
        precision = tp / (tp + fp)  # Positive Predictive Value
        print(f"  Precision (PPV):   {precision:.3f} ({precision*100:.1f}%)")

    # Detailed results
    print(f"\n📝 Detailed Results:")
    for result in results:
        status_icon = "✅" if result['correct'] else "❌"
        true_label = "Malignant" if result['true_label'] == 1 else "Benign"
        pred_label = "Malignant" if result['predicted_class'] == 1 else "Benign"
        print(f"  {status_icon} {result['filename']}: {true_label} → {pred_label} (Confidence: {result['confidence']:.3f})")

def create_visualization(results):
    """Create visualization of results."""
    if not results:
        return

    # Prepare data for plotting
    confidences = [r['confidence'] for r in results]
    correct = [r['correct'] for r in results]
    true_labels = [r['true_label'] for r in results]

    # Create subplots
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 10))

    # 1. Confidence distribution
    ax1.hist(confidences, bins=20, alpha=0.7, color='skyblue', edgecolor='black')
    ax1.set_xlabel('Confidence')
    ax1.set_ylabel('Frequency')
    ax1.set_title('Confidence Distribution')
    ax1.axvline(np.mean(confidences), color='red', linestyle='--', label=f'Mean: {np.mean(confidences):.3f}')
    ax1.legend()

    # 2. Accuracy by confidence threshold
    thresholds = np.arange(0.5, 1.0, 0.05)
    accuracies = []
    for threshold in thresholds:
        high_conf_results = [r for r in results if r['confidence'] >= threshold]
        if high_conf_results:
            acc = sum(1 for r in high_conf_results if r['correct']) / len(high_conf_results)
            accuracies.append(acc)
        else:
            accuracies.append(0)

    ax2.plot(thresholds, accuracies, marker='o', color='green')
    ax2.set_xlabel('Confidence Threshold')
    ax2.set_ylabel('Accuracy')
    ax2.set_title('Accuracy vs Confidence Threshold')
    ax2.grid(True, alpha=0.3)

    # 3. Confidence by true label
    benign_conf = [r['confidence'] for r in results if r['true_label'] == 0]
    malignant_conf = [r['confidence'] for r in results if r['true_label'] == 1]

    ax3.boxplot([benign_conf, malignant_conf], labels=['Benign', 'Malignant'])
    ax3.set_ylabel('Confidence')
    ax3.set_title('Confidence by True Label')

    # 4. Correct vs Incorrect predictions
    correct_conf = [r['confidence'] for r in results if r['correct']]
    incorrect_conf = [r['confidence'] for r in results if not r['correct']]

    ax4.boxplot([correct_conf, incorrect_conf], labels=['Correct', 'Incorrect'])
    ax4.set_ylabel('Confidence')
    ax4.set_title('Confidence by Prediction Accuracy')

    plt.tight_layout()
    plt.savefig('skin_prediction_analysis.png', dpi=300, bbox_inches='tight')
    print(f"\n📊 Visualization saved as 'skin_prediction_analysis.png'")

def main():
    print("🎯 Real Skin Images Prediction Test")
    print("=" * 60)

    # Check if API is running
    try:
        response = requests.get("http://localhost:4000/", timeout=5)
        if response.status_code == 200:
            print("✅ Local Docker API is running")
        else:
            print("❌ Local Docker API is not responding")
            return
    except:
        print("❌ Local Docker API is not running. Start it with: make run")
        return

    # Check if skin images directory exists
    if not os.path.exists(SKIN_IMAGES_PATH):
        print(f"❌ Skin images directory not found: {SKIN_IMAGES_PATH}")
        return

    print(f"✅ Found skin images directory: {SKIN_IMAGES_PATH}")

    # Get test images
    print(f"\n🖼️  Loading test images...")
    test_images = get_test_images()
    print(f"Loaded {len(test_images)} test images ({len([img for img in test_images if img['true_label'] == 0])} benign, {len([img for img in test_images if img['true_label'] == 1])} malignant)")

    # Test prediction service
    print(f"\n🧪 Testing prediction service...")
    results = test_prediction_service(test_images)

    # Analyze results
    analyze_results(results)

    # Create visualization
    print(f"\n📊 Creating visualization...")
    create_visualization(results)

    print(f"\n🎉 Test completed!")
    print(f"📋 Summary:")
    print(f"  - Total images tested: {len(results)}")
    print(f"  - Overall accuracy: {sum(1 for r in results if r['correct'])/len(results)*100:.1f}%")
    print(f"  - Average confidence: {np.mean([r['confidence'] for r in results]):.3f}")

if __name__ == "__main__":
    main()
