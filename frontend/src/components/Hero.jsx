// Hero.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCamera, FiUpload, FiCpu } from 'react-icons/fi';

export default function Hero() {
  return (
    <div className="relative overflow-hidden pt-36 pb-20 px-6">
      {/* Background Orbs */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/10 w-80 h-80 bg-pink-500/10 dark:bg-purple-500/15 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
        
        {/* Left: Text & CTA */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 dark:bg-cyan-400/10 border border-indigo-500/20 dark:border-cyan-400/20 text-xs font-semibold tracking-wider uppercase text-indigo-700 dark:text-cyan-400 mb-6">
              <FiCpu className="w-3.5 h-3.5 animate-spin" /> Deep Learning powered Facial AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display font-black text-5xl md:text-6xl lg:text-7xl leading-tight text-slate-900 dark:text-white"
          >
            Decoding <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-500 bg-clip-text text-transparent">Facial Expressions</span> In Real Time
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-slate-600 dark:text-slate-300 mt-6 leading-relaxed max-w-2xl"
          >
            DeepFER utilizes custom Convolutional Neural Networks trained on the FER2013 dataset to deliver split-second, highly accurate classification of 7 core human emotions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mt-10"
          >
            <Link to="/upload" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-cyan-500 dark:to-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-500/20 font-bold hover:shadow-indigo-500/30 transition-all focus:outline-none"
              >
                <FiUpload className="w-5 h-5" /> Upload Image
              </motion.button>
            </Link>
            <Link to="/live" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-slate-800 dark:text-white rounded-2xl shadow-xl font-bold hover:bg-white/20 dark:hover:bg-white/10 transition-all focus:outline-none backdrop-blur-md"
              >
                <FiCamera className="w-5 h-5 text-indigo-500 dark:text-cyan-400" /> Start Live Camera
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* Right: Graphic Card Mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex-1 max-w-md w-full"
        >
          <div className="relative group p-6 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl hover:shadow-indigo-500/10 dark:hover:shadow-cyan-400/5 transition-all duration-500">
            
            {/* Fake Detection Feed Graphic */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              {/* Scan Line Animation */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 to-pink-500 dark:from-cyan-400 dark:to-indigo-500 opacity-60 shadow-lg animate-[scan_3s_ease-in-out_infinite]" />
              
              {/* Dummy Facial Vector grid */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:16px_16px]" />
              
              <div className="text-8xl select-none filter drop-shadow-[0_0_20px_rgba(99,102,241,0.5)]">
                😊
              </div>

              {/* Bounding box display */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border-2 border-indigo-500/80 dark:border-cyan-400/80 rounded-2xl flex items-center justify-center">
                <span className="absolute -top-6 left-0 bg-indigo-500 dark:bg-cyan-500 text-white text-xs font-bold px-2 py-0.5 rounded-md shadow-md animate-bounce">
                  Happy: 98.56%
                </span>
                {/* Bounding Box Corner markers */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-indigo-500 dark:border-cyan-500 -mt-1 -ml-1 rounded-tl-sm" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-indigo-500 dark:border-cyan-500 -mt-1 -mr-1 rounded-tr-sm" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-indigo-500 dark:border-cyan-500 -mb-1 -ml-1 rounded-bl-sm" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-indigo-500 dark:border-cyan-500 -mb-1 -mr-1 rounded-br-sm" />
              </div>
            </div>

            {/* Metrics cards inside graphic block */}
            <div className="grid grid-cols-3 gap-3 mt-4 text-center">
              <div className="p-3 bg-white/5 dark:bg-white/5 border border-white/5 rounded-xl">
                <span className="block text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Inference</span>
                <span className="block text-slate-800 dark:text-slate-200 font-display font-extrabold text-sm mt-1">42 ms</span>
              </div>
              <div className="p-3 bg-white/5 dark:bg-white/5 border border-white/5 rounded-xl">
                <span className="block text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Confidence</span>
                <span className="block text-indigo-600 dark:text-cyan-400 font-display font-extrabold text-sm mt-1">98.56%</span>
              </div>
              <div className="p-3 bg-white/5 dark:bg-white/5 border border-white/5 rounded-xl">
                <span className="block text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Classes</span>
                <span className="block text-slate-800 dark:text-slate-200 font-display font-extrabold text-sm mt-1">7 Emotions</span>
              </div>
            </div>

          </div>
        </motion.div>

      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    </div>
  );
}
