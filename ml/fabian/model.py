import torch
import torch.nn as nn
from torchvision.models import efficientnet_b3, EfficientNet_B3_Weights

class EnhancedModel(nn.Module):
    def __init__(self, num_classes=2):
        super().__init__()
        # Load pretrained EfficientNet-B3
        self.effnet = efficientnet_b3(weights=EfficientNet_B3_Weights.DEFAULT)

        # Modify the classifier
        num_features = self.effnet.classifier[1].in_features
        self.effnet.classifier = nn.Sequential(
            nn.Dropout(p=0.3),
            nn.Linear(num_features, 512),
            nn.ReLU(),
            nn.Dropout(p=0.2),
            nn.Linear(512, num_classes)
        )

    def forward(self, x):
        return self.effnet(x)
