// DashboardCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardCard({ title, value, icon, description, trend, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="p-6 rounded-2xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 hover:border-slate-300 dark:hover:border-slate-700 shadow-xl backdrop-blur-md flex items-center justify-between gap-6"
    >
      <div className="flex-1">
        <span className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <span className="block font-display font-black text-3xl text-slate-800 dark:text-white mt-2 leading-none">
          {value}
        </span>
        {description && (
          <span className="block text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
            {description}
          </span>
        )}
      </div>

      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 dark:from-cyan-400/10 dark:to-indigo-500/10 border border-indigo-500/20 dark:border-cyan-400/20 flex items-center justify-center text-indigo-600 dark:text-cyan-400 shadow-inner">
        {icon}
      </div>
    </motion.div>
  );
}
