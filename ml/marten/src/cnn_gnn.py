from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Resizing, Conv2D, Flatten, Dense
from tensorflow.keras.preprocessing import image_dataset_from_directory

import os

# OS agnostic path handling
dirname = os.path.dirname(__file__)
train_data_path = os.path.join(dirname, '../data/train')
test_data_path = os.path.join(dirname, '../data/test')

# load training data locally
train_dataset = image_dataset_from_directory(train_data_path,
                                             labels='inferred',
                                             label_mode=('categorical'),
                                             image_size=(224, 224),
                                             batch_size=32,
                                             shuffle=True)

# load testing data locally
# test_dataset = image_dataset_from_directory('../data/test',
#                                             labels='inferred',
#                                             label_mode=('categorical'),
#                                             image_size=(224, 224),
#                                             batch_size=32,
#                                             shuffle=False)

type(train_dataset)

#model = Sequential([
