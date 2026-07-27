# utils.py
import base64
import io
import numpy as np
from PIL import Image
import cv2

def base64_to_cv2(base64_str: str) -> np.ndarray:
    """
    Decodes a base64 encoded image string to an OpenCV BGR image array.
    Supports formats with or without the header (e.g., 'data:image/jpeg;base64,...').
    """
    if "," in base64_str:
        base64_str = base64_str.split(",")[1]
    
    img_data = base64.b64decode(base64_str)
    # Convert bytes to PIL Image, then to BGR numpy array
    pil_image = Image.open(io.BytesIO(img_data)).convert("RGB")
    cv_image = cv2.cvtColor(np.array(pil_image), cv2.COLOR_RGB2BGR)
    return cv_image

def bytes_to_cv2(img_bytes: bytes) -> np.ndarray:
    """
    Decodes raw image bytes to an OpenCV BGR image array.
    """
    nparr = np.frombuffer(img_bytes, np.uint8)
    img_cv2 = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img_cv2 is None:
        raise ValueError("Failed to decode image bytes to OpenCV format")
    return img_cv2
