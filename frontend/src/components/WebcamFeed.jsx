// WebcamFeed.jsx
import React, { useRef, useState, useEffect } from 'react';
import Webcam from 'react-webcam';
import { FiCamera, FiVideoOff, FiActivity, FiRefreshCw } from 'react-icons/fi';
import { predictBase64 } from '../services/api';

export default function WebcamFeed({ onPrediction, isStreaming, setIsStreaming }) {
  const webcamRef = useRef(null);
  const [fps, setFps] = useState(0);
  const [fpsCount, setFpsCount] = useState(0);
  const [lastTime, setLastTime] = useState(Date.now());
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  // Toggle Stream State
  const toggleStream = () => {
    setIsStreaming(!isStreaming);
    onPrediction(null);
  };

  // Flip Camera Direction (User vs Environment)
  const flipCamera = () => {
    setIsFrontCamera(prev => !prev);
  };

  useEffect(() => {
    let intervalId;

    if (isStreaming) {
      intervalId = setInterval(async () => {
        if (webcamRef.current) {
          const imageSrc = webcamRef.current.getScreenshot();
          if (imageSrc) {
            try {
              // Capture timestamp for FPS check
              const now = Date.now();
              const timeDiff = now - lastTime;
              if (timeDiff >= 1000) {
                setFps(fpsCount);
                setFpsCount(0);
                setLastTime(now);
              } else {
                setFpsCount(prev => prev + 1);
              }

              // Send base64 representation of frame to backend
              const res = await predictBase64(imageSrc);
              onPrediction(res);
            } catch (err) {
              console.error("Frame prediction failed:", err);
            }
          }
        }
      }, 500); // 2 FPS rate limit to prevent backend overloading
    } else {
      setFps(0);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStreaming, onPrediction, lastTime, fpsCount]);

  const videoConstraints = {
    width: 640,
    height: 480,
    facingMode: isFrontCamera ? "user" : "environment"
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      
      {/* Video Container */}
      <div className="relative w-full aspect-video rounded-3xl bg-slate-950 overflow-hidden shadow-2xl border border-white/10">
        {isStreaming ? (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-full object-cover scale-x-[-1]" // mirror effect
            />
            {/* HUD Status Bar */}
            <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
              <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-emerald-400 backdrop-blur-md">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
                LIVE FEED
              </div>
              <div className="flex items-center gap-4">
                {fps > 0 && (
                  <div className="bg-black/60 px-3 py-1.5 rounded-full border border-white/10 text-xs font-bold text-slate-300 backdrop-blur-md flex items-center gap-1.5">
                    <FiActivity className="w-3.5 h-3.5 text-cyan-400" />
                    {fps} FPS
                  </div>
                )}
              </div>
            </div>
            
            {/* Overlay grid scanning overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.01)_50%,rgba(0,0,0,0.1)_50%)] bg-[size:100%_4px] pointer-events-none" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 dark:text-slate-500 gap-4 p-8 text-center">
            <FiVideoOff className="w-16 h-16 opacity-30 animate-pulse text-indigo-500 dark:text-cyan-400" />
            <div>
              <h3 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-200">
                Camera is Offline
              </h3>
              <p className="text-sm mt-1 max-w-xs text-slate-500 dark:text-slate-400">
                Click Start Stream to activate your web camera and start real-time inference.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Control Panel */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleStream}
          className={`flex items-center gap-2 px-8 py-3.5 rounded-2xl font-bold shadow-xl border focus:outline-none transition-all ${
            isStreaming
              ? 'bg-rose-500 border-rose-600 text-white shadow-rose-500/20 hover:bg-rose-600'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-cyan-500 dark:to-indigo-600 border-transparent text-white shadow-indigo-500/20 dark:shadow-cyan-400/10'
          }`}
        >
          {isStreaming ? (
            <>
              <FiVideoOff className="w-5 h-5" /> Stop Stream
            </>
          ) : (
            <>
              <FiCamera className="w-5 h-5" /> Start Stream
            </>
          )}
        </button>

        {isStreaming && (
          <button
            onClick={flipCamera}
            className="p-3.5 rounded-2xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-slate-800 dark:text-white hover:bg-white/20 dark:hover:bg-white/10 transition-all focus:outline-none shadow-xl"
            title="Flip Camera Side"
          >
            <FiRefreshCw className="w-5 h-5" />
          </button>
        )}
      </div>

    </div>
  );
}
