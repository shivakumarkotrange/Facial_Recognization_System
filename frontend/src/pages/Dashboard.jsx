// Dashboard.jsx
import React, { useEffect, useMemo, useState } from 'react';
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { FiActivity, FiAward, FiClock, FiTrash2, FiTv, FiTrendingUp } from 'react-icons/fi';
import toast from 'react-hot-toast';
import DashboardCard from '../components/DashboardCard';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title);

import { checkHealth } from '../services/api';

const DUMMY_HISTORY = [
  { id: 1, timestamp: '2026-07-27T09:05:00.000Z', emotion: 'Happy', confidence: 92.3, source: 'upload' },
  { id: 2, timestamp: '2026-07-27T09:12:00.000Z', emotion: 'Neutral', confidence: 84.1, source: 'webcam' },
  { id: 3, timestamp: '2026-07-27T09:20:00.000Z', emotion: 'Surprise', confidence: 90.4, source: 'upload' },
  { id: 4, timestamp: '2026-07-27T09:28:00.000Z', emotion: 'Angry', confidence: 88.7, source: 'webcam' },
  { id: 5, timestamp: '2026-07-27T09:41:00.000Z', emotion: 'Happy', confidence: 95.2, source: 'webcam' },
  { id: 6, timestamp: '2026-07-27T09:55:00.000Z', emotion: 'Sad', confidence: 81.8, source: 'upload' },
];

const EMOTION_COLORS = {
  Happy: 'rgba(234, 179, 8, 0.75)',
  Sad: 'rgba(59, 130, 246, 0.75)',
  Angry: 'rgba(239, 68, 68, 0.75)',
  Fear: 'rgba(168, 85, 247, 0.75)',
  Surprise: 'rgba(20, 184, 166, 0.75)',
  Disgust: 'rgba(249, 115, 22, 0.75)',
  Neutral: 'rgba(100, 116, 139, 0.75)',
};

const EMOTION_BORDER_COLORS = {
  Happy: 'rgb(234, 179, 8)',
  Sad: 'rgb(59, 130, 246)',
  Angry: 'rgb(239, 68, 68)',
  Fear: 'rgb(168, 85, 247)',
  Surprise: 'rgb(20, 184, 166)',
  Disgust: 'rgb(249, 115, 22)',
  Neutral: 'rgb(100, 116, 139)',
};

export default function Dashboard() {
  const [history, setHistory] = useState(DUMMY_HISTORY);
  const [loading, setLoading] = useState(true);
  const [usingDummyData, setUsingDummyData] = useState(false);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const savedHistory = localStorage.getItem('deepfer-history');
        if (savedHistory) {
          const parsed = JSON.parse(savedHistory);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setHistory(parsed);
            setUsingDummyData(false);
            setLoading(false);
            return;
          }
        }

        try {
          await checkHealth({ retries: 1 });
          setHistory((prev) => prev.length > 0 ? prev : DUMMY_HISTORY);
          setUsingDummyData(true);
        } catch {
          setHistory(DUMMY_HISTORY);
          setUsingDummyData(true);
        }
      } catch (error) {
        console.error('Unable to load dashboard history:', error);
        setHistory(DUMMY_HISTORY);
        setUsingDummyData(true);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
    const interval = window.setInterval(loadHistory, 4000);
    return () => window.clearInterval(interval);
  }, []);

  const todayDetections = useMemo(() => {
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return history.filter((record) => new Date(record.timestamp) >= startOfToday).length;
  }, [history]);

  const totalDetections = history.length;

  const emotionDistribution = useMemo(() => {
    const counts = { Happy: 0, Sad: 0, Angry: 0, Fear: 0, Surprise: 0, Disgust: 0, Neutral: 0 };
    history.forEach((record) => {
      if (counts[record.emotion] !== undefined) {
        counts[record.emotion] += 1;
      }
    });
    return counts;
  }, [history]);

  const topEmotion = useMemo(() => {
    let max = -1;
    let emotion = 'None';
    Object.entries(emotionDistribution).forEach(([key, value]) => {
      if (value > max && value > 0) {
        max = value;
        emotion = key;
      }
    });
    return emotion;
  }, [emotionDistribution]);

  const recentPredictions = useMemo(() => history.slice(0, 5), [history]);

  const clearRecords = () => {
    localStorage.removeItem('deepfer-history');
    setHistory(DUMMY_HISTORY);
    setUsingDummyData(true);
    toast.success('Detection history reset to sample data.');
  };

  const pieData = {
    labels: Object.keys(emotionDistribution),
    datasets: [
      {
        data: Object.values(emotionDistribution),
        backgroundColor: Object.keys(emotionDistribution).map((key) => EMOTION_COLORS[key]),
        borderColor: Object.keys(emotionDistribution).map((key) => EMOTION_BORDER_COLORS[key]),
        borderWidth: 1.5,
      },
    ],
  };

  const barData = {
    labels: Object.keys(emotionDistribution),
    datasets: [
      {
        label: 'Detection Frequency',
        data: Object.values(emotionDistribution),
        backgroundColor: 'rgba(99, 102, 241, 0.4)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1.5,
        borderRadius: 8,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'currentColor',
          font: { family: 'Inter', size: 11 },
        },
      },
    },
  };

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-6 pb-20 pt-32">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="font-display text-4xl font-black text-slate-800 dark:text-white md:text-5xl">
            Analytics <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent dark:from-cyan-400 dark:to-indigo-500">Dashboard</span>
          </h1>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            Monitor today's detections, emotion trends, and recent predictions in one place.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {usingDummyData && (
            <span className="rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-600 dark:text-amber-400">
              Preview mode
            </span>
          )}
          <button
            onClick={clearRecords}
            className="flex items-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 px-5 py-3 text-sm font-bold text-rose-600 shadow-md transition-all hover:bg-rose-500/20 focus:outline-none dark:text-rose-400"
          >
            <FiTrash2 className="h-4 w-4" /> Reset sample data
          </button>
        </div>
      </div>

      <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard title="Today's Detections" value={todayDetections} icon={<FiClock className="h-6 w-6" />} description="Checks captured today" delay={0} />
        <DashboardCard title="Total Detections" value={totalDetections} icon={<FiActivity className="h-6 w-6" />} description="All recorded predictions" delay={0.05} />
        <DashboardCard title="Dominant Emotion" value={topEmotion} icon={<FiAward className="h-6 w-6" />} description="Most frequent expression" delay={0.1} />
        <DashboardCard title="Webcam Detections" value={history.filter((item) => item.source === 'webcam').length} icon={<FiTv className="h-6 w-6" />} description="Live camera samples" delay={0.15} />
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/20 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl">
          <FiTrendingUp className="mx-auto mb-4 h-10 w-10 animate-pulse text-indigo-500 dark:text-cyan-400" />
          <p className="text-sm text-slate-500 dark:text-slate-400">Loading dashboard metrics…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <h3 className="mb-6 font-display text-xl font-bold text-slate-800 dark:text-white">Emotion Distribution</h3>
            <div className="relative h-[300px]">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <h3 className="mb-6 font-display text-xl font-bold text-slate-800 dark:text-white">Detection Counts</h3>
            <div className="relative h-[300px]">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          <div className="lg:col-span-2 rounded-[2rem] border border-white/20 bg-white/10 p-6 shadow-2xl backdrop-blur-xl md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-display text-xl font-bold text-slate-800 dark:text-white">Recent Predictions</h3>
              <span className="text-sm text-slate-500 dark:text-slate-400">Latest activity</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200/20 text-xs font-bold uppercase tracking-[0.2em] text-slate-500 dark:border-slate-800/50">
                    <th className="px-4 py-4">#</th>
                    <th className="px-4 py-4">Timestamp</th>
                    <th className="px-4 py-4">Emotion</th>
                    <th className="px-4 py-4">Confidence</th>
                    <th className="px-4 py-4">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/10 dark:divide-slate-800/30">
                  {recentPredictions.map((record, index) => (
                    <tr key={record.id} className="text-slate-700 transition-colors hover:bg-white/5 dark:text-slate-300">
                      <td className="px-4 py-4 font-bold">{index + 1}</td>
                      <td className="px-4 py-4 text-xs font-mono">{new Date(record.timestamp).toLocaleString()}</td>
                      <td className="px-4 py-4 font-semibold text-slate-800 dark:text-white">{record.emotion}</td>
                      <td className="px-4 py-4 font-display font-extrabold text-indigo-600 dark:text-cyan-400">{record.confidence.toFixed(1)}%</td>
                      <td className="px-4 py-4">
                        <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${record.source === 'webcam' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}`}>
                          {record.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
