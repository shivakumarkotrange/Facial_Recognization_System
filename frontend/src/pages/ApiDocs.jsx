import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, ChevronDown, ChevronRight, Copy, Zap, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

const copy = (text) => {
  navigator.clipboard.writeText(text);
  toast.success('Copied to clipboard!');
};

/* ── Code Block Component ─────────────────────────────────────── */
function CodeBlock({ code }) {
  return (
    <div style={{ position: 'relative' }}>
      <pre style={{
        background: 'rgba(0,0,0,0.4)', borderRadius: '12px', padding: '20px 24px',
        fontFamily: 'JetBrains Mono, monospace', fontSize: '0.83rem', lineHeight: 1.7,
        color: '#e2e8f0', overflow: 'auto', border: '1px solid rgba(255,255,255,0.06)',
        margin: 0,
      }}>
        <code>{code}</code>
      </pre>
      <button onClick={() => copy(code)}
        style={{ position: 'absolute', top: 12, right: 12, background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)', borderRadius: '8px', padding: '5px 10px', cursor: 'pointer', color: '#a5b4fc', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
        <Copy size={13} /> Copy
      </button>
    </div>
  );
}

/* ── Endpoint Card ────────────────────────────────────────────── */
function EndpointCard({ method, path, description, request, response, params }) {
  const [open, setOpen] = useState(method === 'POST');
  const methodColors = { GET: '#10b981', POST: '#6366f1', DELETE: '#f43f5e', PUT: '#f59e0b' };
  const color = methodColors[method] || '#94a3b8';

  return (
    <motion.div className="glass-card" style={{ overflow: 'hidden', marginBottom: '16px' }} layout>
      <button onClick={() => setOpen(o => !o)}
        style={{ width: '100%', background: 'none', border: 'none', padding: '20px 24px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px', textAlign: 'left' }}>
        <span style={{ padding: '4px 10px', borderRadius: '6px', background: `${color}20`, color, border: `1px solid ${color}44`, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, fontSize: '0.78rem', letterSpacing: '0.05em', flexShrink: 0 }}>
          {method}
        </span>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600 }}>{path}</span>
        <span style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.85rem', fontFamily: 'Inter, sans-serif' }}>{description}</span>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', borderTop: '1px solid var(--border-glass)', padding: '0 24px 24px' }}>
            <div style={{ paddingTop: '20px' }}>
              {params && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Parameters</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                        {['Name', 'Type', 'Required', 'Description'].map(h => (
                          <th key={h} style={{ padding: '8px 12px', textAlign: 'left', color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.75rem' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {params.map(p => (
                        <tr key={p.name} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', color: '#a5b4fc', fontWeight: 600 }}>{p.name}</td>
                          <td style={{ padding: '9px 12px', fontFamily: 'JetBrains Mono, monospace', color: '#34d399', fontSize: '0.82rem' }}>{p.type}</td>
                          <td style={{ padding: '9px 12px', color: p.required ? '#f43f5e' : '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>{p.required ? 'Required' : 'Optional'}</td>
                          <td style={{ padding: '9px 12px', color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {request && (
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Request</h4>
                  <CodeBlock code={request} />
                </div>
              )}
              {response && (
                <div>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>Response</h4>
                  <CodeBlock code={response} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── API Docs Page ────────────────────────────────────────────── */
const ENDPOINTS = [
  {
    method: 'GET', path: '/health',
    description: 'Health check endpoint',
    response: JSON.stringify({ status: 'ok', model_loaded: true, version: '1.0.0' }, null, 2),
  },
  {
    method: 'POST', path: '/predict',
    description: 'Predict emotion from uploaded image',
    params: [
      { name: 'file', type: 'File', required: true, desc: 'Image file (JPG, PNG, WEBP, max 10MB)' },
    ],
    request: `# Using curl
curl -X POST http://localhost:8000/predict \\
  -F "file=@/path/to/face.jpg"

# Using Python requests
import requests
with open("face.jpg", "rb") as f:
    res = requests.post(
        "http://localhost:8000/predict",
        files={"file": f}
    )
print(res.json())`,
    response: JSON.stringify({
      emotion: 'Happy',
      confidence: 98.4,
      face_detected: true,
      all_emotions: [
        { emotion: 'happy',    confidence: 98.4 },
        { emotion: 'neutral',  confidence: 0.9 },
        { emotion: 'surprise', confidence: 0.5 },
        { emotion: 'sad',      confidence: 0.2 },
        { emotion: 'angry',    confidence: 0.0 },
        { emotion: 'fear',     confidence: 0.0 },
        { emotion: 'disgust',  confidence: 0.0 },
      ],
      processing_time_ms: 42,
    }, null, 2),
  },
  {
    method: 'POST', path: '/predict/base64',
    description: 'Predict emotion from base64 encoded image',
    params: [
      { name: 'image', type: 'string', required: true, desc: 'Base64 encoded image data' },
    ],
    request: JSON.stringify({ image: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/...' }, null, 2),
    response: JSON.stringify({ emotion: 'Sad', confidence: 87.2, face_detected: true }, null, 2),
  },
  {
    method: 'GET', path: '/emotions',
    description: 'Get list of supported emotion classes',
    response: JSON.stringify({
      emotions: ['angry', 'disgust', 'fear', 'happy', 'neutral', 'sad', 'surprise'],
      count: 7,
      model: 'CNN-FER2013-v1',
    }, null, 2),
  },
  {
    method: 'GET', path: '/model/info',
    description: 'Get model architecture and performance info',
    response: JSON.stringify({
      model_name: 'DeepFER-CNN',
      architecture: 'CNN (Conv2D + Dense)',
      dataset: 'FER2013',
      train_accuracy: 0.974,
      val_accuracy: 0.891,
      total_params: 3_897_607,
      input_shape: [48, 48, 1],
    }, null, 2),
  },
];

const QUICK_START = `# 1. Install dependencies
pip install -r requirements.txt

# 2. Start the API server
uvicorn app:app --host 0.0.0.0 --port 8000 --reload

# 3. Test the API
curl http://localhost:8000/health

# 4. Predict an emotion
curl -X POST http://localhost:8000/predict \\
  -F "file=@face.jpg"`;

export default function ApiDocs() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '36px' }}>
        <span className="chip" style={{ marginBottom: '12px', display: 'inline-flex' }}><Code2 size={13} /> REST API</span>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800 }}>
          API <span className="gradient-text">Documentation</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px', lineHeight: 1.7 }}>
          DeepFER REST API · Base URL:{' '}
          <code style={{ fontFamily: 'JetBrains Mono, monospace', background: 'rgba(99,102,241,0.12)', padding: '2px 8px', borderRadius: '6px', color: '#a5b4fc', fontSize: '0.9rem' }}>
            http://localhost:8000
          </code>
        </p>
      </motion.div>

      {/* Info banner */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="glass-card"
        style={{ padding: '20px 24px', marginBottom: '28px', display: 'flex', gap: '16px', alignItems: 'flex-start', background: 'rgba(99,102,241,0.06)', borderColor: 'rgba(99,102,241,0.2)' }}>
        <Zap size={20} style={{ color: '#6366f1', flexShrink: 0, marginTop: 2 }} />
        <div>
          <div style={{ fontWeight: 700, marginBottom: '4px' }}>FastAPI + Auto-Docs</div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.87rem', lineHeight: 1.6 }}>
            The backend also provides automatic interactive documentation at{' '}
            <a href="http://localhost:8000/docs" target="_blank" rel="noopener noreferrer"
              style={{ color: '#6366f1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={13} /> /docs (Swagger UI)
            </a>{' '}and{' '}
            <a href="http://localhost:8000/redoc" target="_blank" rel="noopener noreferrer"
              style={{ color: '#6366f1', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Globe size={13} /> /redoc
            </a>.
          </p>
        </div>
      </motion.div>

      {/* Quick Start */}
      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} style={{ padding: '28px', marginBottom: '28px' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem' }}>
          🚀 Quick Start
        </h2>
        <CodeBlock code={QUICK_START} language="bash" />
      </motion.div>

      {/* Endpoints */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <h2 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Code2 size={20} style={{ color: '#6366f1' }} /> Endpoints
        </h2>
        {ENDPOINTS.map(ep => <EndpointCard key={`${ep.method}-${ep.path}`} {...ep} />)}
      </motion.div>

      {/* Error codes */}
      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: '28px', marginTop: '24px' }}>
        <h2 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '1rem' }}>⚠️ Error Codes</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.87rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
              {['Code', 'Meaning', 'Resolution'].map(h => (
                <th key={h} style={{ padding: '9px 12px', textAlign: 'left', color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['400', 'Bad Request – Invalid image', 'Ensure you send a valid image file'],
              ['422', 'Unprocessable Entity', 'Check request body / form-data structure'],
              ['500', 'Internal Server Error', 'Check backend logs; model may not be loaded'],
              ['503', 'Service Unavailable', 'Model is still loading at startup'],
            ].map(([code, meaning, res]) => (
              <tr key={code} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                <td style={{ padding: '11px 12px', fontFamily: 'JetBrains Mono, monospace', color: '#f43f5e', fontWeight: 700 }}>{code}</td>
                <td style={{ padding: '11px 12px', color: 'var(--text-secondary)' }}>{meaning}</td>
                <td style={{ padding: '11px 12px', color: 'var(--text-muted)', fontSize: '0.82rem' }}>{res}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </div>
  );
}
