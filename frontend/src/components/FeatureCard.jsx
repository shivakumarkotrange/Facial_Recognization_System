// FeatureCard.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function FeatureCard({ icon, title, description, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
      className="p-8 rounded-2xl bg-white/50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800/50 hover:border-indigo-500/30 dark:hover:border-cyan-500/30 shadow-xl backdrop-blur-md transition-all duration-300 group"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-indigo-500 flex items-center justify-center text-white mb-6 shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-cyan-400 transition-colors">
        {title}
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed text-sm">
        {description}
      </p>
    </motion.div>
  );
}
