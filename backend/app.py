# app.py
import logging
import time
from fastapi import FastAPI, File, UploadFile, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Imports from local backend files
from config import EMOTIONS
from predict import predictor
from utils import bytes_to_cv2, base64_to_cv2

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger("deepfer_app")

app = FastAPI(
    title="DeepFER API",
    description="Facial Emotion Recognition using Deep Learning",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base64 request body schema
class Base64ImageRequest(BaseModel):
    image: str  # Base64 encoded image string

# Response schema matching the strict user requirements
class PredictionResponse(BaseModel):
    emotion: str
    confidence: float
    face_detected: bool
    bbox: dict
    all_emotions: list[dict]
    processing_time_ms: float

@app.get("/health")
async def health_check():
    """Health check endpoint to verify backend status and model loading."""
    return {
        "status": "healthy",
        "model_loaded": predictor.loaded,
        "supported_emotions": EMOTIONS
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_image_file(file: UploadFile = File(...)):
    """
    Predict emotion from an uploaded image file (multipart/form-data).
    """
    # Verify content type
    if file.content_type and not file.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is not a valid image."
        )
    
    try:
        t_start = time.perf_counter()
        img_bytes = await file.read()
        cv_img = bytes_to_cv2(img_bytes)
        
        # Run inference
        result = predictor.predict(cv_img)
        t_elapsed = (time.perf_counter() - t_start) * 1000.0
        
        # Add processing time to results
        result["processing_time_ms"] = round(t_elapsed, 2)
        return result

    except Exception as e:
        logger.error(f"Error processing image upload prediction: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during prediction: {str(e)}"
        )

@app.post("/predict/base64", response_model=PredictionResponse)
async def predict_image_base64(request: Base64ImageRequest):
    """
    Predict emotion from a base64 encoded image string (e.g., from live webcam stream).
    """
    if not request.image:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No image data provided."
        )

    try:
        t_start = time.perf_counter()
        cv_img = base64_to_cv2(request.image)
        
        # Run inference
        result = predictor.predict(cv_img)
        t_elapsed = (time.perf_counter() - t_start) * 1000.0
        
        result["processing_time_ms"] = round(t_elapsed, 2)
        return result

    except Exception as e:
        logger.error(f"Error processing base64 image prediction: {e}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred during base64 prediction: {str(e)}"
        )

# Direct execution
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
