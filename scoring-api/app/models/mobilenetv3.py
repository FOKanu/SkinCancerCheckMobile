import torch
import torch.nn as nn
from torchvision.models import mobilenet_v3_large

class MobileNetV3Classifier(nn.Module):
    def __init__(self, num_classes):
        super().__init__()
        # Initialize the model architecture without loading weights
        self.model = mobilenet_v3_large(weights=None)
        # Replace the classifier for our number of classes
        self.model.classifier[-1] = nn.Linear(self.model.classifier[-1].in_features, num_classes)

    def forward(self, x):
        return self.model(x) 