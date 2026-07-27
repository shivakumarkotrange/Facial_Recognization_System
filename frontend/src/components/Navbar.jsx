// Navbar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiActivity } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Upload', path: '/upload' },
    { name: 'Live Camera', path: '/live' },
    { name: 'Detect', path: '/detect' },
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-white/5 dark:bg-black/20 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl rounded-2xl px-6 py-3 transition-colors duration-300">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
            <FiActivity className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-extrabold text-2xl tracking-wide bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-cyan-400 dark:via-indigo-400 dark:to-purple-500 bg-clip-text text-transparent">
            DeepFER
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className="relative text-sm font-semibold tracking-wide transition-colors focus:outline-none"
                style={{
                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                }}
              >
                {link.name}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-600 to-pink-600 dark:from-cyan-400 dark:to-indigo-500 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
        </div>

        {/* Mobile menu trigger */}
        <div className="md:hidden flex items-center gap-4">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-slate-700 dark:text-slate-300 focus:outline-none"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-6 right-6 md:hidden bg-slate-900/95 dark:bg-black/90 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-4">
              {links.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`text-lg font-medium px-4 py-2 rounded-xl transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                        : 'text-slate-300 hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
