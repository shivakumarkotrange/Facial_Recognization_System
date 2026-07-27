# config.py
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
MODEL_DIR = BASE_DIR / "model"
MODEL_PATH = MODEL_DIR / "emotion_model.h5"
DATASET_DIR = BASE_DIR.parent / "dataset" / "FER2013"

# Image Configuration
IMG_SIZE = 48
NUM_CLASSES = 7

# Emotion Map
EMOTIONS = ["Angry", "Disgust", "Fear", "Happy", "Sad", "Surprise", "Neutral"]

# Training Parameters
BATCH_SIZE = 64
EPOCHS = 50
LEARNING_RATE = 0.001

# OpenCV Face Detector Haar Cascade Path
import cv2
HAAR_CASCADE_PATH = cv2.data.haarcascades + "haarcascade_frontalface_default.xml"
