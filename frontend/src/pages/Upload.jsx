// Upload.jsx
import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUploadCloud,
  FiImage,
  FiAlertCircle,
  FiCheckCircle,
  FiCpu,
  FiClock,
  FiTrash2,
  FiSettings,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getErrorMessage, predictImage, savePredictionToHistory } from '../services/api';

// Mapping of emotions to background gradients, emojis, and specific colors
const EMOTION_THEMES = {
  Happy: { emoji: '😊', gradient: 'from-amber-400 to-yellow-500 shadow-yellow-500/20 text-yellow-500', bgSoft: 'bg-yellow-500/10 border-yellow-500/20' },
  Sad: { emoji: '😢', gradient: 'from-blue-400 to-indigo-600 shadow-blue-500/20 text-blue-400', bgSoft: 'bg-blue-500/10 border-blue-500/20' },
  Angry: { emoji: '😡', gradient: 'from-red-500 to-rose-600 shadow-red-500/20 text-rose-500', bgSoft: 'bg-rose-500/10 border-rose-500/20' },
  Fear: { emoji: '😨', gradient: 'from-purple-400 to-violet-600 shadow-purple-500/20 text-purple-400', bgSoft: 'bg-purple-500/10 border-purple-500/20' },
  Surprise: { emoji: '😲', gradient: 'from-teal-400 to-emerald-500 shadow-teal-500/20 text-emerald-400', bgSoft: 'bg-teal-500/10 border-teal-500/20' },
  Disgust: { emoji: '🤢', gradient: 'from-orange-400 to-red-500 shadow-orange-500/20 text-orange-500', bgSoft: 'bg-orange-500/10 border-orange-500/20' },
  Neutral: { emoji: '😐', gradient: 'from-slate-400 to-slate-500 shadow-slate-500/20 text-slate-400', bgSoft: 'bg-slate-500/10 border-slate-500/20' },
};

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // File drop handler
  const onDrop = useCallback((acceptedFiles) => {
    setError(null);
    setPrediction(null);
    const selectedFile = acceptedFiles[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.bmp']
    },
    multiple: false
  });

  const handlePredict = async () => {
    if (!file) {
      toast.error('Please select or drop an image first.');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const responseData = await predictImage(file, { retries: 2 });
      setPrediction(responseData);
      savePredictionToHistory(responseData, 'upload');
      toast.success(`Analysis complete: ${responseData.emotion}`);
    } catch (err) {
      const errMsg = getErrorMessage(err, 'Inference failed. Verify that the backend server is running on localhost:8000.');
      setError(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setPrediction(null);
    setError(null);
  };

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      {/* Visual Header Title */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <motion.span 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 dark:bg-cyan-400/10 border border-indigo-500/20 dark:border-cyan-400/20 text-xs font-bold text-indigo-700 dark:text-cyan-400 uppercase tracking-wider mb-4"
        >
          <FiCpu className="w-3.5 h-3.5" /> Static Image Inference
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-display font-black text-4xl md:text-5xl text-slate-800 dark:text-white"
        >
          Upload <span className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-indigo-500 bg-clip-text text-transparent">Image</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-sm mt-3 text-slate-500 dark:text-slate-400"
        >
          Drag and drop your photo or browse files locally to identify expressions using the deep learning CNN.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start mt-8">
        
        {/* Left Side: Drag & Drop Dropzone + controls */}
        <div className="flex flex-col gap-6">
          <div
            {...getRootProps()}
            className={`relative group rounded-3xl p-8 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[350px] bg-white/5 dark:bg-black/10 backdrop-blur-md ${
              isDragActive
                ? 'border-indigo-500 bg-indigo-500/5 dark:border-cyan-400 dark:bg-cyan-400/5'
                : preview
                ? 'border-slate-300 dark:border-slate-700'
                : 'border-slate-300 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-cyan-400/50 hover:bg-white/10 dark:hover:bg-white/5'
            }`}
          >
            <input {...getInputProps()} />
            
            {preview ? (
              <div className="relative w-full flex flex-col items-center gap-4">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl max-h-[350px] border border-white/20">
                  <img
                    src={preview}
                    alt="Source upload preview"
                    className="max-h-[350px] object-contain block mx-auto rounded-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none opacity-40 mix-blend-overlay" />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Drag and drop or click here to replace this image
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center">
                <motion.div
                  animate={isDragActive ? { y: -10 } : { y: 0 }}
                  className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-cyan-400/10 flex items-center justify-center text-indigo-600 dark:text-cyan-400 mb-6 group-hover:scale-105 transition-transform"
                >
                  <FiUploadCloud className="w-8 h-8" />
                </motion.div>
                <h3 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-200">
                  Drag & Drop image here
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm max-w-xs">
                  Supports JPEG, PNG, WEBP, and BMP up to 10MB
                </p>
                <button
                  type="button"
                  className="mt-6 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-white/5 hover:scale-102 transition-all focus:outline-none"
                >
                  Browse Files
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          {preview && (
            <div className="flex items-center gap-4">
              <button
                onClick={handlePredict}
                disabled={loading}
                className="flex-1 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-cyan-500 dark:to-indigo-600 text-white font-bold rounded-2xl shadow-xl shadow-indigo-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:scale-100 focus:outline-none"
              >
                {loading ? 'Processing Inference...' : 'Predict Emotion'}
              </button>
              <button
                onClick={handleClear}
                disabled={loading}
                className="px-6 py-4 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-slate-800 dark:text-slate-200 font-bold rounded-2xl hover:bg-white/20 dark:hover:bg-white/10 transition-all disabled:opacity-50 focus:outline-none"
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Prediction Visualizer Results Panel */}
        <div className="rounded-3xl p-8 bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl min-h-[400px] flex flex-col justify-center">
          <AnimatePresence mode="wait">
            
            {/* 1. Loading Spinner state */}
            {loading && (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex flex-col items-center justify-center text-center py-10"
              >
                <div className="relative w-16 h-16 mb-6">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-600 dark:border-cyan-400/10 dark:border-t-cyan-400"
                  />
                  <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
                    className="absolute inset-2 rounded-full border-4 border-purple-500/10 border-t-purple-600 dark:border-indigo-400/10 dark:border-t-indigo-400"
                  />
                </div>
                <h4 className="font-display font-bold text-slate-700 dark:text-slate-300">
                  Running Neural Network...
                </h4>
                <p className="text-xs text-slate-500 mt-2">
                  Standardizing image, isolating face boundary boxes, and resolving Softmax layers.
                </p>
              </motion.div>
            )}

            {/* 2. Error Message State */}
            {error && !loading && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-center text-rose-600 dark:text-rose-400 flex flex-col items-center gap-3"
              >
                <FiAlertCircle className="w-10 h-10 text-rose-500" />
                <h4 className="font-display font-extrabold text-lg">Inference Error</h4>
                <p className="text-xs max-w-sm leading-relaxed text-slate-600 dark:text-slate-400">
                  {error}
                </p>
                <button
                  onClick={handlePredict}
                  className="mt-2 px-4 py-2 rounded-xl bg-rose-500 text-white font-bold text-xs hover:bg-rose-600 shadow-lg shadow-rose-500/10 focus:outline-none"
                >
                  Retry Prediction
                </button>
              </motion.div>
            )}

            {/* 3. Prediction Card State */}
            {prediction && !loading && !error && (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* Header Statistics Card */}
                <div className="flex items-center justify-between pb-6 border-b border-slate-200/20 dark:border-slate-800/50">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Primary Classification
                    </span>
                    <h3 className="font-display font-black text-3xl text-slate-800 dark:text-white mt-1 flex items-center gap-2">
                      <span className="text-4xl">
                        {(EMOTION_THEMES[prediction.emotion] || EMOTION_THEMES.Neutral).emoji}
                      </span>
                      {prediction.emotion}
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Confidence
                    </span>
                    <h3 className="font-display font-black text-3xl text-indigo-600 dark:text-cyan-400 mt-1">
                      {prediction.confidence.toFixed(2)}%
                    </h3>
                  </div>
                </div>

                {/* Subheading Parameters Metadata */}
                <div className="grid grid-cols-3 gap-4 bg-white/5 border border-white/5 p-4 rounded-2xl text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex flex-col gap-1 items-center text-center">
                    <FiClock className="w-4 h-4 text-indigo-500 dark:text-cyan-400 mb-1" />
                    <span>Inference Speed</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{prediction.processing_time_ms} ms</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center border-x border-slate-200/10 dark:border-slate-800/40">
                    <FiCheckCircle className="w-4 h-4 text-indigo-500 dark:text-cyan-400 mb-1" />
                    <span>Face Traced</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{prediction.face_detected ? 'Yes' : 'No'}</span>
                  </div>
                  <div className="flex flex-col gap-1 items-center text-center">
                    <FiSettings className="w-4 h-4 text-indigo-500 dark:text-cyan-400 mb-1" />
                    <span>Resolution</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">48 x 48 px</span>
                  </div>
                </div>

                {/* Detailed Probability breakdown graphs */}
                <div className="space-y-4">
                  <h4 className="font-display font-bold text-lg text-slate-700 dark:text-slate-300">
                    Confidence Distribution
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {prediction.all_emotions.map((item, idx) => {
                      const theme = EMOTION_THEMES[item.emotion] || EMOTION_THEMES.Neutral;
                      const isTop = item.emotion === prediction.emotion;
                      return (
                        <motion.div
                          key={item.emotion}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                            isTop 
                              ? `${theme.bgSoft} border-indigo-500/30 dark:border-cyan-400/30 shadow-md`
                              : 'bg-white/10 dark:bg-slate-900/20 border-slate-200/50 dark:border-slate-800/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300">
                              <span>{theme.emoji}</span>
                              {item.emotion}
                            </span>
                            <span className={`text-sm font-black ${isTop ? theme.text : 'text-slate-500'}`}>
                              {item.confidence.toFixed(1)}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mt-3">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${item.confidence}%` }}
                              transition={{ duration: 0.6, delay: 0.1 }}
                              className={`h-full bg-gradient-to-r ${theme.gradient}`}
                            />
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            )}

            {/* 4. Empty visual state */}
            {!prediction && !loading && !error && (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center p-8 text-slate-500 dark:text-slate-400 flex flex-col items-center gap-4"
              >
                <div className="w-16 h-16 rounded-full bg-indigo-500/10 dark:bg-cyan-400/10 flex items-center justify-center text-indigo-600 dark:text-cyan-400 animate-bounce">
                  <FiImage className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-xl text-slate-700 dark:text-slate-300">
                    Awaiting Inference Feed
                  </h3>
                  <p className="text-xs mt-1.5 max-w-xs mx-auto leading-relaxed">
                    Select an image first. Then click "Predict Emotion" to run deep learning classifications.
                  </p>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
