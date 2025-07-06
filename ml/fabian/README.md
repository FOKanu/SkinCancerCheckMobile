# Cancer Lesion Classification with MobileNetV3

This project implements a deep learning model using MobileNetV3 for classifying cancerous lesions in medical images.

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Prepare your dataset:
   - Organize your images in a directory structure
   - Create a list of image paths and corresponding labels
   - Update the `main()` function in `train.py` with your data paths

## Features

- Uses MobileNetV3 architecture (pretrained on ImageNet)
- Implements data augmentation using Albumentations
- Includes learning rate scheduling
- Saves the best model based on validation accuracy
- Generates training history plots
- Supports both CPU and GPU training

## Model Architecture

The model uses MobileNetV3-Large as the backbone, modified for binary classification (cancerous vs non-cancerous). The model includes:
- Pretrained MobileNetV3 features
- Custom classifier head for binary classification
- Cross-entropy loss function
- Adam optimizer with learning rate scheduling

## Data Augmentation

The training pipeline includes the following augmentations:
- Random resized crop
- Horizontal and vertical flips
- Random brightness and contrast adjustments
- Normalization using ImageNet statistics

## Usage

1. Prepare your dataset and update the data loading section in `train.py`
2. Run the training script:
```bash
python train.py
```

## Output

The training process will:
- Save the best model as `best_model.pth`
- Generate a training history plot as `training_history.png`
- Display progress bars with loss and accuracy metrics
- Print epoch-wise training and validation metrics

## Customization

You can modify the following parameters in `train.py`:
- `num_classes`: Number of classes (default: 2)
- `batch_size`: Batch size for training (default: 32)
- `num_epochs`: Number of training epochs (default: 50)
- `learning_rate`: Initial learning rate (default: 0.001)

## Requirements

See `requirements.txt` for the complete list of dependencies. 