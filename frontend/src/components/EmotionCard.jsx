// EmotionCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

const EMOTION_STYLES = {
  Happy: { emoji: '😊', bg: 'from-amber-400 to-yellow-500 shadow-yellow-500/20 text-yellow-600 dark:text-yellow-400' },
  Sad: { emoji: '😢', bg: 'from-blue-400 to-indigo-600 shadow-blue-500/20 text-blue-600 dark:text-blue-400' },
  Angry: { emoji: '😡', bg: 'from-red-500 to-rose-600 shadow-red-500/20 text-red-600 dark:text-red-400' },
  Fear: { emoji: '😨', bg: 'from-purple-400 to-violet-600 shadow-purple-500/20 text-purple-600 dark:text-purple-400' },
  Surprise: { emoji: '😲', bg: 'from-teal-400 to-emerald-500 shadow-teal-500/20 text-emerald-600 dark:text-emerald-400' },
  Disgust: { emoji: '🤢', bg: 'from-orange-400 to-red-500 shadow-orange-500/20 text-orange-600 dark:text-orange-400' },
  Neutral: { emoji: '😐', bg: 'from-slate-400 to-slate-500 shadow-slate-500/20 text-slate-600 dark:text-slate-400' },
};

export default function EmotionCard({ emotion, confidence, percentage = 0, isTop = false, delay = 0 }) {
  const style = EMOTION_STYLES[emotion] || EMOTION_STYLES.Neutral;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`p-6 rounded-2xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${
        isTop
          ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 dark:from-cyan-500/10 dark:to-indigo-500/10 border-indigo-500/40 dark:border-cyan-500/40 shadow-xl shadow-indigo-500/5'
          : 'bg-white/40 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-tr ${style.bg} flex items-center justify-center text-2xl shadow-lg`}>
            {style.emoji}
          </div>
          <div>
            <h4 className="font-display font-extrabold text-lg text-slate-800 dark:text-slate-100">
              {emotion}
            </h4>
            {isTop && (
              <span className="inline-block text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400 mt-0.5">
                Top Emotion
              </span>
            )}
          </div>
        </div>
        <span className={`font-display font-black text-xl ${style.text}`}>
          {confidence.toFixed(2)}%
        </span>
      </div>

      <div className="mt-5">
        <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, delay: delay + 0.2 }}
            className={`h-full bg-gradient-to-r ${style.bg}`}
          />
        </div>
      </div>
    </motion.div>
  );
}
export { EMOTION_STYLES };
