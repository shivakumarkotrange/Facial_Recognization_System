import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

export const getErrorMessage = (error, fallback = 'The request could not be completed.') => {
  if (axios.isAxiosError(error)) {
    const detail = error.response?.data?.detail || error.response?.data?.message || error.message;
    if (detail) return detail;
    if (error.code === 'ERR_NETWORK') {
      return 'Unable to reach the backend server. Make sure the FastAPI server is running on http://localhost:8000.';
    }
    if (error.code === 'ECONNABORTED') {
      return 'The request timed out. Please try again.';
    }
  }
  return fallback;
};

const withRetry = async (requestFn, { retries = 2, delayMs = 600 } = {}) => {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;
      if (attempt === retries) {
        break;
      }
      await wait(delayMs * (attempt + 1));
    }
  }
  throw lastError;
};

export const checkHealth = async (options = {}) => {
  const response = await withRetry(() => api.get('/health'), options);
  return response.data;
};

export const predictImage = async (imageFile, options = {}) => {
  const formData = new FormData();
  formData.append('file', imageFile);

  const response = await withRetry(
    () =>
      api.post('/predict', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    options,
  );

  return response.data;
};

export const predictBase64 = async (base64Image, options = {}) => {
  const response = await withRetry(
    () => api.post('/predict/base64', { image: base64Image }),
    options,
  );
  return response.data;
};

export const savePredictionToHistory = (prediction, source = 'upload') => {
  try {
    const stored = localStorage.getItem('deepfer-history');
    const history = stored ? JSON.parse(stored) : [];
    const record = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      emotion: prediction.emotion,
      confidence: prediction.confidence,
      source,
    };

    localStorage.setItem('deepfer-history', JSON.stringify([record, ...history].slice(0, 100)));
  } catch (error) {
    console.error('Unable to save prediction history:', error);
  }
};

export default api;
