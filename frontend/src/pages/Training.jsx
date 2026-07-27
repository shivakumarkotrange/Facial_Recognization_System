import { motion } from 'framer-motion';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement,
  LineElement, Filler, Tooltip, Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Brain, Database, Layers, Settings, Award, TrendingUp } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

/* ── Simulated training data ─────────────────────────────────── */
const EPOCHS = Array.from({ length: 50 }, (_, i) => i + 1);

function makeCurve(start, end, noise = 0.01) {
  return EPOCHS.map((e, i) => {
    const t = i / (EPOCHS.length - 1);
    const base = start + (end - start) * (1 - Math.exp(-4 * t));
    return parseFloat((base + (Math.random() - 0.5) * noise).toFixed(4));
  });
}

const trainAcc  = makeCurve(0.12, 0.974, 0.012);
const valAcc    = makeCurve(0.11, 0.891, 0.02);
const trainLoss = makeCurve(1.95, 0.08, 0.03).reverse();
const valLoss   = makeCurve(1.9, 0.31, 0.05).reverse();

const CHART_OPTIONS = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: '#94a3b8', font: { family: 'Inter', size: 12 }, padding: 16 } },
    tooltip: {
      backgroundColor: 'rgba(9,13,26,0.95)', borderColor: 'rgba(99,102,241,0.3)', borderWidth: 1,
      titleColor: '#f8fafc', bodyColor: '#94a3b8',
      titleFont: { family: 'Outfit', weight: 'bold' }, bodyFont: { family: 'Inter' },
    },
  },
  scales: {
    x: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, maxTicksLimit: 10 } },
    y: { grid: { color: 'rgba(255,255,255,0.04)' }, ticks: { color: '#94a3b8', font: { family: 'Inter', size: 11 } } },
  },
  elements: { line: { tension: 0.4 }, point: { radius: 0 } },
};

const accData = {
  labels: EPOCHS,
  datasets: [
    { label: 'Train Accuracy',      data: trainAcc, borderColor: '#6366f1', backgroundColor: 'rgba(99,102,241,0.08)', fill: true, borderWidth: 2 },
    { label: 'Validation Accuracy', data: valAcc,   borderColor: '#06b6d4', backgroundColor: 'rgba(6,182,212,0.06)',  fill: true, borderWidth: 2 },
  ],
};
const lossData = {
  labels: EPOCHS,
  datasets: [
    { label: 'Train Loss',      data: trainLoss, borderColor: '#f43f5e', backgroundColor: 'rgba(244,63,94,0.08)', fill: true, borderWidth: 2 },
    { label: 'Validation Loss', data: valLoss,   borderColor: '#f59e0b', backgroundColor: 'rgba(245,158,11,0.06)', fill: true, borderWidth: 2 },
  ],
};

/* ── CNN Architecture layers ─────────────────────────────────── */
const CNN_LAYERS = [
  { name: 'Input',        detail: '48×48×1 (Grayscale)',         color: '#6366f1' },
  { name: 'Conv2D',       detail: '64 filters, 3×3, ReLU',       color: '#8b5cf6' },
  { name: 'BatchNorm',    detail: 'Normalize activations',        color: '#8b5cf6' },
  { name: 'MaxPooling',   detail: '2×2, stride 2',               color: '#06b6d4' },
  { name: 'Dropout',      detail: '25%',                          color: '#94a3b8' },
  { name: 'Conv2D',       detail: '128 filters, 3×3, ReLU',      color: '#8b5cf6' },
  { name: 'BatchNorm',    detail: 'Normalize activations',        color: '#8b5cf6' },
  { name: 'MaxPooling',   detail: '2×2, stride 2',               color: '#06b6d4' },
  { name: 'Dropout',      detail: '25%',                          color: '#94a3b8' },
  { name: 'Conv2D',       detail: '256 filters, 3×3, ReLU',      color: '#8b5cf6' },
  { name: 'BatchNorm',    detail: 'Normalize activations',        color: '#8b5cf6' },
  { name: 'MaxPooling',   detail: '2×2, stride 2',               color: '#06b6d4' },
  { name: 'Dropout',      detail: '25%',                          color: '#94a3b8' },
  { name: 'Flatten',      detail: '→ 1D vector',                  color: '#10b981' },
  { name: 'Dense',        detail: '512 units, ReLU',             color: '#f59e0b' },
  { name: 'Dropout',      detail: '50%',                          color: '#94a3b8' },
  { name: 'Dense (Out)',  detail: '7 units, Softmax',            color: '#f43f5e' },
];

const PARAMS = [
  { label: 'Optimizer',    value: 'Adam',         icon: '⚡' },
  { label: 'Learning Rate',value: '0.001',        icon: '📈' },
  { label: 'Batch Size',   value: '64',           icon: '📦' },
  { label: 'Epochs',       value: '50',           icon: '🔄' },
  { label: 'Loss Fn',      value: 'Cat. CE',      icon: '📉' },
  { label: 'Train Split',  value: '80/20',        icon: '✂️' },
  { label: 'Augmentation', value: 'Yes (flip/rot)',icon: '🔃' },
  { label: 'Regularizer',  value: 'L2 + Dropout', icon: '🛡️' },
];

const METRICS = [
  { label: 'Train Accuracy',  value: '97.4%', color: '#6366f1' },
  { label: 'Val Accuracy',    value: '89.1%', color: '#06b6d4' },
  { label: 'F1 Score',        value: '0.887', color: '#10b981' },
  { label: 'Precision',       value: '0.891', color: '#f59e0b' },
  { label: 'Recall',          value: '0.883', color: '#ec4899' },
  { label: 'AUC-ROC',         value: '0.972', color: '#f43f5e' },
];

const FER_CLASSES = [
  { label: 'Angry',    count: '4953', emoji: '😡' },
  { label: 'Disgust',  count: '547',  emoji: '🤢' },
  { label: 'Fear',     count: '5121', emoji: '😨' },
  { label: 'Happy',    count: '8989', emoji: '😊' },
  { label: 'Neutral',  count: '6198', emoji: '😐' },
  { label: 'Sad',      count: '6077', emoji: '😢' },
  { label: 'Surprise', count: '4002', emoji: '😲' },
];

export default function Training() {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px', position: 'relative', zIndex: 1 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '36px' }}>
        <span className="chip" style={{ marginBottom: '12px', display: 'inline-flex' }}><Brain size={13} /> Model Training</span>
        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem,4vw,2.6rem)', fontWeight: 800 }}>
          Training <span className="gradient-text">Insights</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '8px' }}>CNN architecture, training parameters, and performance metrics</p>
      </motion.div>

      {/* Dataset Info */}
      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        style={{ padding: '28px', marginBottom: '24px', background: 'linear-gradient(135deg,rgba(99,102,241,0.08),rgba(6,182,212,0.04))', borderColor: 'rgba(99,102,241,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ width: 52, height: 52, borderRadius: '14px', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6366f1', flexShrink: 0 }}>
            <Database size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'Outfit, sans-serif', fontWeight: 800, fontSize: '1.2rem', marginBottom: '8px' }}>FER2013 Dataset</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '16px' }}>
              The <strong style={{ color: 'var(--text-primary)' }}>Facial Expression Recognition 2013</strong> dataset consists of 48×48 pixel grayscale images of faces.
              Total: <strong style={{ color: '#6366f1' }}>35,887 images</strong> across 7 emotion classes. Collected via Google Image Search and labeled by crowd workers.
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {FER_CLASSES.map(c => (
                <div key={c.label} style={{ padding: '8px 14px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', minWidth: '80px' }}>
                  <div style={{ fontSize: '1.2rem' }}>{c.emoji}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 700, marginTop: '3px' }}>{c.label}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{c.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics + Params */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }} className="two-col">
        {/* Performance Metrics */}
        <motion.div className="glass-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} style={{ padding: '28px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={18} style={{ color: '#f59e0b' }} /> Performance Metrics
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {METRICS.map(m => (
              <div key={m.label} style={{ padding: '16px', borderRadius: '12px', background: `${m.color}10`, border: `1px solid ${m.color}25`, textAlign: 'center' }}>
                <div style={{ fontFamily: 'Outfit, sans-serif', fontSize: '1.4rem', fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '3px' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Training Parameters */}
        <motion.div className="glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} style={{ padding: '28px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Settings size={18} style={{ color: '#8b5cf6' }} /> Training Parameters
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {PARAMS.map(p => (
              <div key={p.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.87rem', color: 'var(--text-secondary)' }}>
                  <span>{p.icon}</span> {p.label}
                </span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{p.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Training Curves */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }} className="two-col">
        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} style={{ padding: '28px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: '#6366f1' }} /> Accuracy Curve
          </h3>
          <div style={{ height: '240px' }}>
            <Line data={accData} options={{ ...CHART_OPTIONS, scales: { ...CHART_OPTIONS.scales, y: { ...CHART_OPTIONS.scales.y, min: 0, max: 1 } } }} />
          </div>
        </motion.div>

        <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ padding: '28px' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrendingUp size={18} style={{ color: '#f43f5e' }} /> Loss Curve
          </h3>
          <div style={{ height: '240px' }}>
            <Line data={lossData} options={CHART_OPTIONS} />
          </div>
        </motion.div>
      </div>

      {/* CNN Architecture */}
      <motion.div className="glass-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} style={{ padding: '28px' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} style={{ color: '#10b981' }} /> CNN Architecture
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', position: 'relative' }}>
          {CNN_LAYERS.map((layer, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {/* Connector line */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
                <div style={{ width: 12, height: 12, borderRadius: '50%', background: layer.color, boxShadow: `0 0 8px ${layer.color}66`, flexShrink: 0 }} />
                {i < CNN_LAYERS.length - 1 && <div style={{ width: 2, height: 28, background: `linear-gradient(${layer.color}66, ${CNN_LAYERS[i+1].color}66)` }} />}
              </div>
              <div style={{ flex: 1, padding: '10px 18px', borderRadius: '10px', background: `${layer.color}0d`, border: `1px solid ${layer.color}25`, marginBottom: i < CNN_LAYERS.length - 1 ? '0' : '0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: layer.color }}>{layer.name}</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>{layer.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <style>{`@media (max-width: 768px) { .two-col { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
