// Footer.jsx
import React from 'react';
import { FiGithub, FiLinkedin, FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="w-full mt-20 border-t border-slate-200/10 dark:border-slate-800/50 py-10 px-6 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Project & Copyright info */}
        <div>
          <span className="font-display font-extrabold text-xl tracking-wide bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-indigo-500 bg-clip-text text-transparent">
            DeepFER
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Facial Emotion Recognition Using Deep Learning & Computer Vision
          </p>
        </div>

        {/* Developer Info */}
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
          <span>Developed with</span>
          <FiHeart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
          <span>by</span>
          <span className="text-slate-800 dark:text-slate-200 font-semibold">DeepFER Team</span>
        </div>

        {/* Social Links */}
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-transparent dark:border-white/5 shadow-md hover:scale-105 transition-all focus:outline-none"
            title="GitHub Repository"
          >
            <FiGithub className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 border border-transparent dark:border-white/5 shadow-md hover:scale-105 transition-all focus:outline-none"
            title="LinkedIn Profile"
          >
            <FiLinkedin className="w-5 h-5" />
          </a>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto text-center mt-6 border-t border-slate-200/5 dark:border-slate-800/10 pt-6">
        <p className="text-xs text-slate-500">
          © {new Date().getFullYear()} DeepFER. All rights reserved. Built for research & demonstration.
        </p>
      </div>
    </footer>
  );
}
