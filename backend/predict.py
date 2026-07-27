# predict.py
import os
import numpy as np
import logging
from config import MODEL_PATH, EMOTIONS
from preprocess import detect_face, crop_and_resize_face, preprocess_for_model

# Try importing TensorFlow
try:
    import tensorflow as tf
    from tensorflow.keras.models import load_model
    TF_AVAILABLE = True
except ImportError:
    TF_AVAILABLE = False
    logging.warning("TensorFlow not installed. Running in mock mode.")

class EmotionModelWrapper:
    def __init__(self, model_path=MODEL_PATH):
        self.model = None
        self.loaded = False
        self.model_path = model_path
        self.load()

    def load(self):
        """Loads the Keras model from model_path."""
        if not TF_AVAILABLE:
            logging.warning("TensorFlow is not available. Model cannot be loaded.")
            return

        if os.path.exists(self.model_path):
            try:
                self.model = load_model(str(self.model_path))
                self.loaded = True
                logging.info(f"Model successfully loaded from {self.model_path}")
            except Exception as e:
                logging.error(f"Error loading model from {self.model_path}: {e}")
        else:
            logging.warning(f"Model file not found at {self.model_path}. Fallback to mock mode.")

    def predict(self, image_np: np.ndarray):
        """
        Runs emotion prediction on the given BGR image.
        Returns: (emotion_label, confidence_score, face_detected, bounding_box, all_emotions_probs)
        """
        # Step 1: Detect Face
        bbox = detect_face(image_np)
        face_detected = bbox is not None
        
        # Step 2: Crop & Resize
        face_roi = crop_and_resize_face(image_np, bbox)
        
        # Step 3: Normalize and format for input
        model_input = preprocess_for_model(face_roi)

        x, y, w, h = (0, 0, image_np.shape[1], image_np.shape[0]) if bbox is None else bbox
        bbox_dict = {"x": int(x), "y": int(y), "w": int(w), "h": int(h)}

        if self.loaded and self.model is not None:
            # Model Predict
            preds = self.model.predict(model_input, verbose=0)[0]
            top_idx = int(np.argmax(preds))
            emotion = EMOTIONS[top_idx]
            confidence = float(preds[top_idx]) * 100.0
            
            all_emotions = [
                {"emotion": EMOTIONS[i], "confidence": round(float(preds[i]) * 100.0, 2)}
                for i in range(len(EMOTIONS))
            ]
        else:
            # Mock mode prediction
            # Make Happy or Neutral slightly more common for pleasant testing
            import random
            probs = np.random.dirichlet(np.ones(len(EMOTIONS)) * 2)
            top_idx = int(np.argmax(probs))
            emotion = EMOTIONS[top_idx]
            confidence = float(probs[top_idx]) * 100.0
            
            all_emotions = [
                {"emotion": EMOTIONS[i], "confidence": round(float(probs[i]) * 100.0, 2)}
                for i in range(len(EMOTIONS))
            ]

        return {
            "emotion": emotion,
            "confidence": round(confidence, 2),
            "face_detected": face_detected,
            "bbox": bbox_dict,
            "all_emotions": all_emotions
        }

# Instantiate global wrapper
predictor = EmotionModelWrapper()
