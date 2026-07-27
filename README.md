# DeepFER - Facial Emotion Recognition Using Deep Learning

DeepFER is a modern, full-stack AI application designed to detect and classify human facial expressions in real-time. By utilizing custom Convolutional Neural Networks (CNNs) trained on the FER2013 dataset, the application delivers accurate, low-latency emotion predictions from static images or live webcam streams.

---

## 🚀 Key Features

*   **Real-time Webcam Classification**: Continuously stream webcam video frames using a client-side polling mechanism to get sub-second emotion inference.
*   **Static Image Uploads**: Drag and drop support for popular image formats (JPEG, PNG, WEBP, BMP) to classify individual expressions.
*   **Aesthetic Glassmorphism UI**: Stunning custom interface equipped with responsive cards, fluid animations (Framer Motion), and global light/dark themes.
*   **Live Analytics Dashboard**: Visualizations of expression metrics using Chart.js displaying pie charts, frequency bar charts, and historical logs.
*   **Robust REST API**: Modular FastAPI endpoints matching strict return configurations:
    ```json
    {
      "emotion": "Happy",
      "confidence": 98.56
    }
    ```
*   **7 Core Emotions Classifications**: Detects:
    *   😊 Happy
    *   😢 Sad
    *   😡 Angry
    *   😨 Fear
    *   😲 Surprise
    *   🤢 Disgust
    *   😐 Neutral

---

## 🛠️ Technology Stack

### Frontend
*   **React 18** (Vite wrapper)
*   **Tailwind CSS** (V4 modern design tokens)
*   **Framer Motion** (Fluid page transitions and micro-interactions)
*   **Chart.js** & **React Chartjs 2** (Interactive graph analytics)
*   **React Icons** (Modern iconography)

### Backend
*   **Python** (FastAPI framework)
*   **TensorFlow/Keras** (Deep learning inference engine)
*   **OpenCV** (Face detection bounding boxes via Haar Cascades)
*   **NumPy** & **Pillow** (Array structures and picture preprocessing)

---

## 📁 Folder Structure

```
DeepFER/
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable views (Navbar, Footer, Webcam, Cards)
│   │   ├── pages/            # View pages (Home, Upload, LiveCamera, Dashboard, About)
│   │   ├── services/         # Axios api endpoints connection
│   │   ├── context/          # Global Dark/Light ThemeContext
│   │   ├── App.jsx           # SPA router
│   │   └── index.css         # Tailwind directives
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── backend/
│   ├── model/                # Saved tensorflow .h5 neural net parameters
│   ├── app.py                # FastAPI main routes
│   ├── predict.py            # Preprocessing -> Model Inference wrapper
│   ├── train.py              # CNN model training and evaluation script
│   ├── preprocess.py         # Haar cascade face crop and image standardizer
│   ├── emotion_model.py      # Sequential CNN model structure definition
│   ├── config.py             # Global paths and parameters
│   ├── utils.py              # Base64 and bytes parser utilities
│   └── requirements.txt      # Python dependencies
│
└── README.md
```

---

## ⚙️ Installation & Running Locally

### Prerequisites
*   Node.js (version 18+)
*   Python (version 3.9+)

### 1. Backend Setup

First, navigate to the `backend` folder:
```bash
cd backend
```

Install Python dependencies:
```bash
pip install -r requirements.txt
```

Start the FastAPI backend server:
```bash
python app.py
```
The API server will run on `http://localhost:8000`. You can access automated Swagger interactive API docs at `http://localhost:8000/docs`.

*(Optional)* Train the CNN model manually:
Ensure you place the Kaggle FER2013 dataset directories inside a `dataset/FER2013/` folder at the root level, then run:
```bash
python train.py --epochs 50 --batch-size 64
```

### 2. Frontend Setup

Open a new terminal window and navigate to the `frontend` folder:
```bash
cd frontend
```

Install npm packages:
```bash
npm install
```

Start the local development server:
```bash
npm run dev
```
Open `http://localhost:5173` inside your browser to access the application.

---

## 📡 API Endpoints Documentation

### `GET /health`
Verifies API status and confirms if the TensorFlow model loaded successfully at startup.

### `POST /predict`
Uploads a raw image file.
*   **Request Body**: `multipart/form-data` containing `file: File`
*   **Response**:
    ```json
    {
      "emotion": "Happy",
      "confidence": 98.56,
      "face_detected": true,
      "bbox": {"x": 120, "y": 80, "w": 200, "h": 200},
      "all_emotions": [...],
      "processing_time_ms": 32.5
    }
    ```

### `POST /predict/base64`
Evaluates expression from an image encoded in base64 string format.
*   **Request Body**:
    ```json
    {
      "image": "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
    }
    ```
*   **Response**: Matches standard `POST /predict` format.

---

## 🚀 Deployment Config

### Frontend (Vercel)
Create a `vercel.json` file inside the `frontend/` directory to manage routes and SPA redirects:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://deepfer-backend.onrender.com/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Backend (Render)
Create a `render.yaml` file at the root level to deploy the FastAPI server:
```yaml
services:
  - type: web
    name: deepfer-backend
    env: python
    buildCommand: pip install -r backend/requirements.txt
    startCommand: uvicorn backend.app:app --host 0.0.0.0 --port $PORT
```
And add a `Procfile` inside the `backend/` folder:
```
web: uvicorn app:app --host 0.0.0.0 --port $PORT
```
