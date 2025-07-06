import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np

class SkinLesionModel:
    def __init__(self):
        self.model = None
        self.input_shape = (224, 224, 3)
        self.num_classes = 2  # benign and malignant

    def build_model(self):
        """Build the CNN model architecture."""
        model = models.Sequential([
            # First Convolutional Block
            layers.Conv2D(32, (3, 3), activation='relu', input_shape=self.input_shape),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),

            # Second Convolutional Block
            layers.Conv2D(64, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),

            # Third Convolutional Block
            layers.Conv2D(128, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),

            # Fourth Convolutional Block
            layers.Conv2D(256, (3, 3), activation='relu'),
            layers.BatchNormalization(),
            layers.MaxPooling2D((2, 2)),

            # Flatten and Dense Layers
            layers.Flatten(),
            layers.Dense(512, activation='relu'),
            layers.Dropout(0.5),
            layers.Dense(self.num_classes, activation='softmax')
        ])

        # Compile model
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )

        self.model = model
        return model

    def load_model(self, model_path: str):
        """Load a saved model."""
        try:
            self.model = tf.keras.models.load_model(model_path)
            return True
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

    def save_model(self, model_path: str):
        """Save the model."""
        if self.model is not None:
            self.model.save(model_path)
            return True
        return False

    def predict(self, image: np.ndarray) -> np.ndarray:
        """Make predictions on an image."""
        if self.model is None:
            raise ValueError("Model not loaded")

        # Ensure image is preprocessed
        if image.shape != self.input_shape:
            raise ValueError(f"Image shape {image.shape} does not match model input shape {self.input_shape}")

        # Add batch dimension if needed
        if len(image.shape) == 3:
            image = np.expand_dims(image, axis=0)

        # Make prediction
        return self.model.predict(image)

    def train(self, train_data, validation_data, epochs=50, batch_size=32):
        """Train the model."""
        if self.model is None:
            self.build_model()

        history = self.model.fit(
            train_data,
            validation_data=validation_data,
            epochs=epochs,
            batch_size=batch_size,
            callbacks=[
                tf.keras.callbacks.EarlyStopping(
                    monitor='val_loss',
                    patience=5,
                    restore_best_weights=True
                ),
                tf.keras.callbacks.ReduceLROnPlateau(
                    monitor='val_loss',
                    factor=0.2,
                    patience=3
                )
            ]
        )

        return history
