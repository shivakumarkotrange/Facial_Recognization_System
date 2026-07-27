# preprocess.py
import cv2
import numpy as np
from PIL import Image
from config import IMG_SIZE, HAAR_CASCADE_PATH

# Load Haar Cascade once
face_cascade = cv2.CascadeClassifier(HAAR_CASCADE_PATH)

def detect_face(image_np: np.ndarray):
    """
    Detect face in the image using Haar Cascade.
    Returns the bounding box coordinates (x, y, w, h) of the largest face, or None if no face is detected.
    """
    if len(image_np.shape) == 3:
        gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
    else:
        gray = image_np

    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    if len(faces) == 0:
        return None
    
    # Return the largest face by area
    largest_face = max(faces, key=lambda rect: rect[2] * rect[3])
    return largest_face

def crop_and_resize_face(image_np: np.ndarray, bbox=None) -> np.ndarray:
    """
    Crops the face using bounding box coordinates and resizes it to IMG_SIZE x IMG_SIZE in grayscale.
    If no bbox is provided, detects the face first. If still not found, processes the whole image.
    """
    if len(image_np.shape) == 3:
        gray = cv2.cvtColor(image_np, cv2.COLOR_BGR2GRAY)
    else:
        gray = image_np

    if bbox is None:
        bbox = detect_face(image_np)

    if bbox is not None:
        x, y, w, h = bbox
        face_roi = gray[y:y+h, x:x+w]
    else:
        face_roi = gray

    resized = cv2.resize(face_roi, (IMG_SIZE, IMG_SIZE))
    return resized

def preprocess_for_model(image_np: np.ndarray) -> np.ndarray:
    """
    Standardize pixel values to [0, 1] and add batch & channel dimensions.
    Expects grayscale face_roi resized to IMG_SIZE.
    Returns shape (1, IMG_SIZE, IMG_SIZE, 1)
    """
    normalized = image_np.astype("float32") / 255.0
    expanded = np.expand_dims(normalized, axis=(0, -1))
    return expanded
