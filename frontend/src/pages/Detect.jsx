import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import toast from 'react-hot-toast';
import {
  Upload, Camera, Image, Download, ZoomIn,
  AlertCircle, CheckCircle2, Loader2, X, Play, Square
} from 'lucide-react';
import { useDetection } from '../context/AppContext';
import { getErrorMessage, predictBase64, predictImage, savePredictionToHistory } from '../services/api';

/* ── Emotion config ───────────────────────────────────────────── */
const EMOTION_CONFIG = {
  happy:    { emoji: '😊', color: '#fbbf24', badge: 'badge-happy' },
  sad:      { emoji: '😢', color: '#60a5fa', badge: 'badge-sad' },
  angry:    { emoji: '😡', color: '#f87171', badge: 'badge-angry' },
  fear:     { emoji: '😨', color: '#a78bfa', badge: 'badge-fear' },
  surprise: { emoji: '😲', color: '#34d399', badge: 'badge-surprise' },
  disgust:  { emoji: '🤢', color: '#f97316', badge: 'badge-disgust' },
  neutral:  { emoji: '😐', color: '#94a3b8', badge: 'badge-neutral' },
};

/* ── Mock prediction for demo (used when backend is offline) ─── */
function mockPredict() {
  const emotions = Object.keys(EMOTION_CONFIG);
  const emotion = emotions[Math.floor(Math.random() * emotions.length)];
  const confidence = (70 + Math.random() * 28).toFixed(1);
  const allEmotions = emotions.map(e => ({ emotion: e, confidence: parseFloat((Math.random() * 100).toFixed(1)) }));
  // Normalize
  const total = allEmotions.reduce((s, x) => s + x.confidence, 0);
  allEmotions.forEach(x => { x.confidence = parseFloat(((x.confidence / total) * 100).toFixed(1)); });
  const winner = allEmotions.find(x => x.emotion === emotion);
  if (winner) winner.confidence = parseFloat(confidence);
  return { emotion, confidence: parseFloat(confidence), all_emotions: allEmotions, face_detected: true };
}

/* ── API call ─────────────────────────────────────────────────── */
async function predictEmotion(imageBlob) {
  if (imageBlob instanceof Blob || imageBlob instanceof File) {
    return predictImage(imageBlob, { retries: 2 });
  }

  if (typeof imageBlob === 'string' && imageBlob.startsWith('data:image')) {
    return predictBase64(imageBlob, { retries: 2 });
  }

  return mockPredict();
}

/* ── Confidence Bar Row ───────────────────────────────────────── */
function ConfidenceRow({ emotion, confidence, isTop }) {
  const cfg = EMOTION_CONFIG[emotion.toLowerCase()] || EMOTION_CONFIG.neutral;
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5px' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.87rem', fontWeight: isTop ? 700 : 400, color: isTop ? cfg.color : 'var(--text-secondary)' }}>
          {cfg.emoji} {emotion.charAt(0).toUpperCase() + emotion.slice(1)}
          {isTop && <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: 100, background: `${cfg.color}22`, color: cfg.color, border: `1px solid ${cfg.color}44` }}>TOP</span>}
        </span>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: isTop ? cfg.color : 'var(--text-muted)' }}>{confidence.toFixed(1)}%</span>
      </div>
      <div className="confidence-bar">
        <motion.div className="confidence-fill" initial={{ width: 0 }} animate={{ width: `${confidence}%` }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
          style={{ background: isTop ? `linear-gradient(90deg, ${cfg.color}cc, ${cfg.color})` : `linear-gradient(90deg, rgba(255,255,255,0.1), rgba(255,255,255,0.15))` }}
        />
      </div>
    </div>
  );
}

/* ── Main Detect Component ───────────────────────────────────── */
export default function Detect() {
  const { addDetection } = useDetection();
  const [mode, setMode] = useState('upload'); // 'upload' | 'webcam'
  const [imagePreview, setImagePreview] = useState(null);
  const [imageBlobRef, setImageBlobRef] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [error, setError] = useState('');
  const [fps, setFps] = useState(0);
  const [liveResult, setLiveResult] = useState(null);

  const webcamRef = useRef(null);
  const fileInputRef = useRef(null);
  const liveIntervalRef = useRef(null);
  const fpsRef = useRef({ count: 0, last: Date.now() });

  /* ── File handling ── */
  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) { toast.error('Please upload a valid image file.'); return; }
    const url = URL.createObjectURL(file);
    setImagePreview(url);
    setImageBlobRef(file);
    setResult(null);
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFile(file);
  }, []);

  const onDragOver = (e) => { e.preventDefault(); setDragging(true); };
  const onDragLeave = () => setDragging(false);

  /* ── Predict from uploaded image ── */
  const handlePredict = async () => {
    if (!imageBlobRef) {
      toast.error('Please upload an image first.');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await predictEmotion(imageBlobRef);
      setResult(data);
      addDetection({ ...data, source: 'upload', imageUrl: imagePreview });
      savePredictionToHistory(data, 'upload');
      toast.success(`Detected: ${data.emotion} (${data.confidence}%)`, { icon: EMOTION_CONFIG[data.emotion?.toLowerCase()]?.emoji });
    } catch (err) {
      const message = getErrorMessage(err, 'Prediction failed.');
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  /* ── Webcam live detection ── */
  const startLiveDetection = () => {
    setWebcamActive(true);
    setError('');
    fpsRef.current = { count: 0, last: Date.now() };
    liveIntervalRef.current = window.setInterval(async () => {
      if (!webcamRef.current) return;
      const screenshot = webcamRef.current.getScreenshot();
      if (!screenshot) return;

      try {
        const data = await predictEmotion(screenshot);
        setLiveResult(data);
        addDetection({ ...data, source: 'webcam' });
        savePredictionToHistory(data, 'webcam');

        fpsRef.current.count += 1;
        const now = Date.now();
        if (now - fpsRef.current.last >= 1000) {
          setFps(fpsRef.current.count);
          fpsRef.current = { count: 0, last: now };
        }
      } catch (err) {
        const message = getErrorMessage(err, 'Live detection failed.');
        setError(message);
        toast.error(message);
      }
    }, 600);
  };

  const stopLiveDetection = () => {
    window.clearInterval(liveIntervalRef.current);
    setWebcamActive(false);
    setLiveResult(null);
    setFps(0);
  };

  useEffect(() => () => window.clearInterval(liveIntervalRef.current), []);

  /* ── Download result ── */
  const downloadResult = () => {
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'deepfer_result.json'; a.click();
  };

  const liveEmotionCfg = liveResult ? EMOTION_CONFIG[liveResult.emotion?.toLowerCase()] || EMOTION_CONFIG.neutral : null;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '36px' }}>
        <span className="chip" style={{ marginBottom: '12px', display: 'inline-flex' }}>
          <Camera size={13} /> Emotion Detection
        </span>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800, marginBottom: '10px' }}>
          Detect <span className="gradient-text">Emotions</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          Upload an image or use your webcam for real-time facial emotion recognition.
        </p>
      </motion.div>

      {/* Mode Tabs */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'var(--bg-card)', padding: '6px', borderRadius: '14px', border: '1px solid var(--border-glass)', width: 'fit-content' }}>
        {[{ id: 'upload', icon: <Image size={16} />, label: 'Image Upload' }, { id: 'webcam', icon: <Camera size={16} />, label: 'Live Webcam' }].map(tab => (
          <button key={tab.id} onClick={() => { setMode(tab.id); stopLiveDetection(); setResult(null); }}
            style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '9px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem', transition: 'all 0.25s ease',
              background: mode === tab.id ? 'linear-gradient(135deg,#6366f1,#8b5cf6)' : 'transparent',
              color: mode === tab.id ? 'white' : 'var(--text-secondary)',
              boxShadow: mode === tab.id ? '0 4px 15px rgba(99,102,241,0.4)' : 'none',
            }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }} className="detect-grid">
        {/* Left Panel */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          {mode === 'upload' ? (
            <div className="glass-card" style={{ padding: '28px' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Upload size={18} style={{ color: '#6366f1' }} /> Upload Image
              </h3>
              {/* Drop zone */}
              <div
                className={`drop-zone ${dragging ? 'active' : ''}`}
                onDrop={onDrop} onDragOver={onDragOver} onDragLeave={onDragLeave}
                onClick={() => fileInputRef.current?.click()}
                style={{ padding: '36px 24px', textAlign: 'center', cursor: 'pointer', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', position: 'relative', overflow: 'hidden' }}
              >
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" style={{ maxHeight: '200px', maxWidth: '100%', borderRadius: '12px', objectFit: 'cover' }} />
                    <button onClick={e => { e.stopPropagation(); setImagePreview(null); setImageBlobRef(null); setResult(null); }}
                      style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'white' }}>
                      <X size={14} />
                    </button>
                  </>
                ) : (
                  <>
                    <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                      <Image size={24} style={{ color: '#6366f1' }} />
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: '6px' }}>Drop image here</p>
                    <p style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>or click to browse · JPG, PNG, WEBP</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }}
                  onChange={e => handleFile(e.target.files[0])} />
              </div>

              <button className="btn-glow" onClick={handlePredict} disabled={loading || !imagePreview}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: loading || !imagePreview ? 0.6 : 1 }}>
                {loading ? <><Loader2 size={18} className="spin" /> Analyzing...</> : <><ZoomIn size={18} /> Analyze Emotion</>}
              </button>
            </div>
          ) : (
            /* Webcam Mode */
            <div className="glass-card" style={{ padding: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={18} style={{ color: '#6366f1' }} /> Live Webcam
                </h3>
                {webcamActive && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="pulse-ring" style={{ width: 8, height: 8, borderRadius: '50%', background: '#f43f5e', display: 'inline-block' }} />
                    <span style={{ fontSize: '0.8rem', color: '#f43f5e', fontWeight: 600 }}>LIVE</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>FPS: {fps}</span>
                  </div>
                )}
              </div>
              <div style={{ borderRadius: '14px', overflow: 'hidden', marginBottom: '20px', background: '#000', position: 'relative', border: '1px solid var(--border-glass)' }}>
                <Webcam ref={webcamRef} audio={false} screenshotFormat="image/jpeg"
                  videoConstraints={{ width: 480, height: 360, facingMode: 'user' }}
                  style={{ width: '100%', display: 'block' }} />
                {/* Live emotion overlay */}
                {liveResult && liveEmotionCfg && (
                  <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)', borderRadius: '10px', padding: '8px 14px', border: `1px solid ${liveEmotionCfg.color}66`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{liveEmotionCfg.emoji}</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: liveEmotionCfg.color }}>{liveResult.emotion}</div>
                      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.7)' }}>{liveResult.confidence}%</div>
                    </div>
                  </div>
                )}
                {/* Scanning lines overlay when active */}
                {webcamActive && (
                  <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(transparent, transparent 2px, rgba(99,102,241,0.02) 2px, rgba(99,102,241,0.02) 4px)' }} />
                )}
              </div>
              <button
                className={webcamActive ? 'btn-outline' : 'btn-glow'}
                onClick={webcamActive ? stopLiveDetection : startLiveDetection}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {webcamActive ? <><Square size={16} /> Stop Detection</> : <><Play size={16} /> Start Live Detection</>}
              </button>
            </div>
          )}
        </motion.div>

        {/* Right Panel – Results */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass-card" style={{ padding: '28px', minHeight: '360px' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={18} style={{ color: '#10b981' }} /> Results
            </h3>

            <AnimatePresence mode="wait">
              {loading ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '16px' }}>
                  <div style={{ width: 60, height: 60, borderRadius: '50%', border: '3px solid rgba(99,102,241,0.2)', borderTop: '3px solid #6366f1', animation: 'spin 0.8s linear infinite' }} />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Analyzing facial expression...</p>
                </motion.div>
              ) : (result || (mode === 'webcam' && liveResult)) ? (
                <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  {(() => {
                    const r = result || liveResult;
                    const cfg = EMOTION_CONFIG[r.emotion?.toLowerCase()] || EMOTION_CONFIG.neutral;
                    return (
                      <>
                        {/* Main emotion display */}
                        <div style={{ textAlign: 'center', marginBottom: '28px', padding: '28px', background: `${cfg.color}11`, borderRadius: '16px', border: `1px solid ${cfg.color}33` }}>
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
                            style={{ fontSize: '4rem', marginBottom: '10px' }}>{cfg.emoji}</motion.div>
                          <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.8rem', fontWeight: 900, color: cfg.color, marginBottom: '4px' }}>
                            {r.emotion?.charAt(0).toUpperCase() + r.emotion?.slice(1)}
                          </div>
                          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                            Confidence: <span style={{ color: cfg.color }}>{r.confidence}%</span>
                          </div>
                          {r.face_detected !== undefined && (
                            <div style={{ marginTop: '8px', fontSize: '0.8rem', color: r.face_detected ? '#10b981' : '#f43f5e', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                              {r.face_detected ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                              {r.face_detected ? 'Face detected' : 'No face detected'}
                            </div>
                          )}
                        </div>

                        {/* All emotions breakdown */}
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>All Probabilities</h4>
                        {(r.all_emotions || Object.keys(EMOTION_CONFIG).map(e => ({ emotion: e, confidence: e === r.emotion?.toLowerCase() ? r.confidence : Math.random() * 30 }))).map(item => (
                          <ConfidenceRow key={item.emotion} emotion={item.emotion} confidence={item.confidence}
                            isTop={item.emotion === r.emotion?.toLowerCase()} />
                        ))}

                        {result && (
                          <button onClick={downloadResult} className="btn-outline"
                            style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', fontSize: '0.88rem' }}>
                            <Download size={15} /> Download Report (JSON)
                          </button>
                        )}
                      </>
                    );
                  })()}
                </motion.div>
              ) : (
                <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 0', gap: '12px', textAlign: 'center' }}>
                  {error && <p style={{ color: '#f43f5e', fontSize: '0.85rem', marginBottom: '8px' }}>{error}</p>}
                  <div style={{ fontSize: '3rem' }}>🎭</div>
                  <p style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>No results yet</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {mode === 'upload' ? 'Upload an image and click Analyze' : 'Start live detection to see results'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @media (max-width: 800px) { .detect-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
