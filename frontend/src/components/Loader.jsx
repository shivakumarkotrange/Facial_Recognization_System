// Loader.jsx
import React from 'react';
import { motion } from 'framer-motion';

export default function Loader({ message = "Analyzing facial features..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
      {/* Premium Multi-ring Spinner */}
      <div className="relative w-20 h-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 rounded-full border-4 border-indigo-500/10 border-t-indigo-600 dark:border-cyan-400/10 dark:border-t-cyan-400"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 rounded-full border-4 border-purple-500/10 border-t-purple-600 dark:border-indigo-400/10 dark:border-t-indigo-400"
        />
        <motion.div
          animate={{ scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-6 rounded-full bg-gradient-to-tr from-pink-500 to-indigo-500 dark:from-cyan-400 dark:to-purple-500 opacity-60 shadow-lg blur-xs"
        />
      </div>
      
      {message && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-slate-600 dark:text-slate-300 font-semibold tracking-wide text-sm mt-6 animate-pulse"
        >
          {message}
        </motion.p>
      )}
    </div>
  );
}
