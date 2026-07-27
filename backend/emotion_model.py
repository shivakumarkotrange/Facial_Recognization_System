# emotion_model.py
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout, BatchNormalization, Input
from config import IMG_SIZE, NUM_CLASSES

def build_cnn_model():
    """
    Defines the CNN Architecture:
    Conv2D -> MaxPooling -> Conv2D -> MaxPooling -> Conv2D -> Flatten -> Dense -> Dropout -> Output Layer
    """
    model = Sequential([
        # Input Layer
        Input(shape=(IMG_SIZE, IMG_SIZE, 1)),
        
        # Conv Block 1
        Conv2D(64, (3, 3), padding="same", activation="relu"),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Conv Block 2
        Conv2D(128, (3, 3), padding="same", activation="relu"),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Conv Block 3
        Conv2D(256, (3, 3), padding="same", activation="relu"),
        BatchNormalization(),
        MaxPooling2D(pool_size=(2, 2)),
        Dropout(0.25),
        
        # Flatten
        Flatten(),
        
        # Dense Layer
        Dense(512, activation="relu"),
        BatchNormalization(),
        Dropout(0.5),
        
        # Output Layer (7 classes)
        Dense(NUM_CLASSES, activation="softmax")
    ])
    
    return model
