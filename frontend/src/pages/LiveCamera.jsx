// LiveCamera.jsx
import React, { useEffect, useRef, useState } from 'react';
import Webcam from 'react-webcam';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiActivity,
  FiCamera,
  FiCpu,
  FiMaximize2,
  FiRefreshCw,
  FiSettings,
  FiVideoOff,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { getErrorMessage, predictBase64, savePredictionToHistory } from '../services/api';

const EMOTION_COLORS = {
  Happy: 'border-yellow-400 text-yellow-400 bg-yellow-400/10 shadow-yellow-400/20',
  Sad: 'border-blue-400 text-blue-400 bg-blue-400/10 shadow-blue-500/20',
  Angry: 'border-red-500 text-rose-500 bg-rose-500/10 shadow-rose-500/20',
  Fear: 'border-purple-400 text-purple-400 bg-purple-400/10 shadow-purple-500/20',
  Surprise: 'border-teal-400 text-emerald-400 bg-emerald-400/10 shadow-emerald-500/20',
  Disgust: 'border-orange-500 text-orange-500 bg-orange-500/10 shadow-orange-500/20',
  Neutral: 'border-slate-400 text-slate-400 bg-slate-400/10 shadow-slate-500/20',
};

export default function LiveCamera() {
  const webcamRef = useRef(null);
  const frameTimerRef = useRef(null);
  const fpsFramesRef = useRef(0);
  const fpsStartRef = useRef(Date.now());
  const inferenceInFlightRef = useRef(false);

  const [isStreaming, setIsStreaming] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [fps, setFps] = useState(0);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [cameraStatus, setCameraStatus] = useState('Stopped');
  const [errorMessage, setErrorMessage] = useState('');

  const handleToggleStream = () => {
    if (isStreaming) {
      setIsStreaming(false);
      setPrediction(null);
      setFps(0);
      setCameraStatus('Stopped');
      setErrorMessage('');
      toast.success('Live camera stopped.');
      return;
    }

    fpsFramesRef.current = 0;
    fpsStartRef.current = Date.now();
    setFps(0);
    setPrediction(null);
    setErrorMessage('');
    setCameraStatus('Starting');
    setIsStreaming(true);
    toast.success('Live camera started.');
  };

  useEffect(() => {
    if (!isStreaming) {
      if (frameTimerRef.current) {
        window.clearInterval(frameTimerRef.current);
        frameTimerRef.current = null;
      }
      inferenceInFlightRef.current = false;
      return undefined;
    }

    setCameraStatus('Streaming');

    frameTimerRef.current = window.setInterval(async () => {
      const video = webcamRef.current?.video;
      if (!video || video.readyState !== 4 || inferenceInFlightRef.current) {
        return;
      }

      const imageSrc = webcamRef.current?.getScreenshot();
      if (!imageSrc) {
        return;
      }

      const now = Date.now();
      fpsFramesRef.current += 1;

      if (now - fpsStartRef.current >= 1000) {
        setFps(fpsFramesRef.current);
        fpsFramesRef.current = 0;
        fpsStartRef.current = now;
      }

      inferenceInFlightRef.current = true;

      try {
        const result = await predictBase64(imageSrc, { retries: 2 });
        setPrediction(result);
        setErrorMessage('');
        setCameraStatus('Streaming');
        savePredictionToHistory(result, 'webcam');
      } catch (err) {
        const message = getErrorMessage(err, 'Unable to reach the prediction API.');
        console.error('Prediction request failed:', err);
        setErrorMessage(message);
        setCameraStatus('Error');
        toast.error(message);
      } finally {
        inferenceInFlightRef.current = false;
      }
    }, 500);

    return () => {
      if (frameTimerRef.current) {
        window.clearInterval(frameTimerRef.current);
        frameTimerRef.current = null;
      }
    };
  }, [isStreaming]);

  useEffect(() => {
    return () => {
      if (frameTimerRef.current) {
        window.clearInterval(frameTimerRef.current);
      }
    };
  }, []);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: isFrontCamera ? 'user' : 'environment',
  };

  return (
    <div className="min-h-screen px-6 pb-20 pt-32">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-indigo-700 dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-400"
          >
            <FiActivity className="h-3.5 w-3.5 animate-pulse" />
            Continuous Video Stream
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-black text-slate-800 dark:text-white md:text-5xl"
          >
            Live{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-indigo-500">
              Camera
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-sm text-slate-500 dark:text-slate-400"
          >
            Use your webcam to capture frames, convert them to base64, and send them to the live prediction endpoint every 500ms.
          </motion.p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1.7fr_0.9fr]">
          <div className="flex flex-col gap-6">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 shadow-2xl">
              <div className="aspect-video w-full">
                {isStreaming ? (
                  <>
                    <Webcam
                      audio={false}
                      ref={webcamRef}
                      screenshotFormat="image/jpeg"
                      videoConstraints={videoConstraints}
                      className="h-full w-full scale-x-[-1] object-cover"
                    />

                    <div className="absolute left-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-bold text-emerald-400 backdrop-blur-md">
                      <span className="h-2.5 w-2.5 animate-ping rounded-full bg-emerald-400" />
                      {cameraStatus}
                    </div>

                    <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-1.5 text-xs font-bold text-slate-200 backdrop-blur-md">
                      <FiActivity className="h-3.5 w-3.5 text-cyan-400" />
                      {fps > 0 ? `${fps} FPS` : 'Live'}
                    </div>

                    {prediction && prediction.face_detected && prediction.bbox && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`absolute z-10 rounded-xl border-4 ${prediction.emotion ? EMOTION_COLORS[prediction.emotion].split(' ')[0] : 'border-indigo-500'}`}
                        style={{
                          left: `${(1 - (prediction.bbox.x + prediction.bbox.w) / 640) * 100}%`,
                          top: `${(prediction.bbox.y / 480) * 100}%`,
                          width: `${(prediction.bbox.w / 640) * 100}%`,
                          height: `${(prediction.bbox.h / 480) * 100}%`,
                          boxShadow: '0 0 25px rgba(99,102,241,0.2)',
                        }}
                      >
                        <div className="absolute -left-0 -top-7 rounded bg-black/80 px-2 py-0.5 text-[10px] font-bold uppercase text-white shadow-md backdrop-blur-md">
                          {prediction.emotion}: {prediction.confidence.toFixed(1)}%
                        </div>
                        <div className="absolute left-0 top-0 h-3 w-3 -ml-1 -mt-1 border-l-4 border-t-4 border-inherit" />
                        <div className="absolute right-0 top-0 h-3 w-3 -mr-1 -mt-1 border-r-4 border-t-4 border-inherit" />
                        <div className="absolute bottom-0 left-0 h-3 w-3 -mb-1 -ml-1 border-b-4 border-l-4 border-inherit" />
                        <div className="absolute bottom-0 right-0 h-3 w-3 -mb-1 -mr-1 border-b-4 border-r-4 border-inherit" />
                      </motion.div>
                    )}

                    <div className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] opacity-40" />
                  </>
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-slate-900/40 p-8 text-center text-slate-500">
                    <FiVideoOff className="h-16 w-16 animate-pulse text-indigo-500 opacity-40" />
                    <div>
                      <h3 className="font-display text-xl font-extrabold text-slate-200">Camera Offline</h3>
                      <p className="mt-1 max-w-xs text-xs text-slate-400">
                        Start the camera to begin capturing frames and streaming predictions.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <button
                onClick={handleToggleStream}
                className={`flex items-center gap-2 rounded-2xl px-8 py-4 font-bold shadow-xl transition-all focus:outline-none ${
                  isStreaming
                    ? 'bg-rose-500 text-white shadow-rose-500/20 hover:bg-rose-600'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/20 hover:opacity-90 dark:from-cyan-500 dark:to-indigo-600'
                }`}
              >
                {isStreaming ? <><FiVideoOff className="h-5 w-5" /> Stop Camera</> : <><FiCamera className="h-5 w-5" /> Start Camera</>}
              </button>

              {isStreaming && (
                <button
                  onClick={() => setIsFrontCamera((prev) => !prev)}
                  className="rounded-2xl border border-white/20 bg-white/10 p-4 text-slate-800 shadow-xl transition-all hover:bg-white/20 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
                  title="Switch camera direction"
                >
                  <FiRefreshCw className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <AnimatePresence mode="wait">
              {prediction ? (
                <motion.div
                  key="prediction-data"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-start justify-between border-b border-slate-200/20 pb-6 dark:border-slate-800/50">
                    <div>
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Detected Emotion</div>
                      <h3 className="mt-1 font-display text-3xl font-black text-slate-800 dark:text-white">{prediction.emotion}</h3>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Confidence</div>
                      <h3 className="mt-1 font-display text-3xl font-black text-indigo-600 dark:text-cyan-400">{prediction.confidence.toFixed(1)}%</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-2">
                      <FiCpu className="h-4 w-4 text-indigo-500 dark:text-cyan-400" />
                      <span>Inference: {prediction.processing_time_ms}ms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FiSettings className="h-4 w-4 text-indigo-500 dark:text-cyan-400" />
                      <span>Face Traced: {prediction.face_detected ? 'Yes' : 'No'}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-display text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Confidence Distribution</h4>
                    <div className="space-y-3">
                      {prediction.all_emotions?.map((item) => {
                        const isTop = item.emotion === prediction.emotion;
                        return (
                          <div key={item.emotion} className="space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                              <span>{item.emotion}</span>
                              <span className={isTop ? 'font-bold text-indigo-600 dark:text-cyan-400' : ''}>{item.confidence.toFixed(1)}%</span>
                            </div>
                            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                              <div
                                className={`h-full rounded-full transition-all duration-300 ${isTop ? 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-indigo-500' : 'bg-slate-400 opacity-30 dark:bg-slate-600'}`}
                                style={{ width: `${item.confidence}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center gap-4 p-8 text-center text-slate-500"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-600 dark:bg-cyan-400/10 dark:text-cyan-400">
                    <FiMaximize2 className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-extrabold text-slate-700 dark:text-slate-300">Live Statistics</h3>
                    <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      Start the live camera to begin capturing frames, reading the webcam, and generating emotion predictions.
                    </p>
                  </div>
                  {errorMessage && <p className="text-sm text-rose-500">{errorMessage}</p>}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <style>{`
        .border-inherit {
          border-color: currentColor;
        }
      `}</style>
    </div>
  );
}
