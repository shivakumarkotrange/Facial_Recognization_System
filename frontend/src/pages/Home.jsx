// Home.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCamera, FiUpload, FiCpu, FiDatabase, FiArrowRight } from 'react-icons/fi';
import Hero from '../components/Hero';
import FeatureCard from '../components/FeatureCard';

export default function Home() {
  const features = [
    {
      icon: <FiCamera className="w-6 h-6" />,
      title: 'Real-Time Webcam stream',
      description: 'Stream webcam frames directly to our deep learning inference service for live emotion updates with bounding box coordinates and frames per second tracker.'
    },
    {
      icon: <FiUpload className="w-6 h-6" />,
      title: 'Static Image uploads',
      description: 'Supports JPEG, PNG, WEBP, and BMP images. Upload close-up faces to immediately check classification statistics across all 7 emotions.'
    },
    {
      icon: <FiCpu className="w-6 h-6" />,
      title: 'Convolutional neural net (CNN)',
      description: 'Optimized multi-layer custom CNN architecture built using Keras and TensorFlow. High classification accuracy with minimal compute footprints.'
    },
    {
      icon: <FiDatabase className="w-6 h-6" />,
      title: 'FER2013 validation',
      description: 'Validation testing verified on the standard FER2013 dataset featuring over 35,000 highly diverse expression image directories.'
    },
  ];

  const steps = [
    { num: '01', title: 'Capture input', desc: 'Either upload an image or turn on the live camera stream.' },
    { num: '02', title: 'Detect face', desc: 'OpenCV Haar cascade dynamically traces bounding box coordinates for faces.' },
    { num: '03', title: 'Inference', desc: 'Deep learning custom CNN evaluates expression probability distributions.' },
    { num: '04', title: 'Display output', desc: 'Outputs the top emotion class along with full probability graphs.' },
  ];

  return (
    <div className="min-h-screen text-slate-800 dark:text-white transition-colors duration-300">
      
      {/* Hero Section */}
      <Hero />

      {/* Project Overview */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold tracking-wider text-indigo-600 dark:text-cyan-400 uppercase">
              Project Overview
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl mt-4 leading-tight">
              A Complete System for <span className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-indigo-500 bg-clip-text text-transparent">Facial Emotion Recognition</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-6 leading-relaxed">
              DeepFER is a full-stack web application that translates pixels into emotions. By combining optimized deep learning models with high-frequency image streaming services, DeepFER achieves desktop-grade performance on all major web browsers.
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed">
              Whether you are analyzing static headshots or running continuous real-time video analytics, our application detects faces, estimates bounds, and maps raw features to Happy, Sad, Angry, Fear, Surprise, Disgust, and Neutral emotions.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl"
          >
            <h3 className="font-display font-bold text-2xl mb-6">Quick Overview Specs</h3>
            <div className="space-y-4">
              {[
                { name: 'Model Engine', value: 'TensorFlow / Keras H5' },
                { name: 'Dataset Target', value: 'FER2013 (35,887 samples)' },
                { name: 'Inference Speed', value: '<50ms (average latency)' },
                { name: 'Face Detection', value: 'OpenCV Haar Cascade' },
              ].map((spec, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-slate-200/20 dark:border-slate-800/50">
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">{spec.name}</span>
                  <span className="text-sm text-slate-800 dark:text-slate-100 font-bold">{spec.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 bg-slate-500/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-bold tracking-wider text-indigo-600 dark:text-cyan-400 uppercase">
              Core Capabilities
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl mt-4">
              Packed with Premium Features
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, idx) => (
              <FeatureCard
                key={idx}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={idx * 0.1}
              />
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="text-xs font-bold tracking-wider text-indigo-600 dark:text-cyan-400 uppercase">
              Inference Flow
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl mt-4">
              How the DeepFER Pipeline Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative p-6 rounded-2xl bg-white/30 dark:bg-slate-900/30 border border-slate-200/50 dark:border-slate-800/50 backdrop-blur-md shadow-lg"
              >
                <div className="font-display font-black text-5xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 dark:from-cyan-400/20 dark:to-indigo-500/20 bg-clip-text text-transparent mb-4">
                  {step.num}
                </div>
                <h3 className="font-display font-bold text-lg text-slate-800 dark:text-slate-100">
                  {step.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dataset & Tech Stack section */}
      <section className="py-24 px-6 bg-slate-500/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-bold tracking-wider text-indigo-600 dark:text-cyan-400 uppercase">
              Training Grounds
            </span>
            <h2 className="font-display font-black text-4xl md:text-5xl mt-4">
              The FER2013 Dataset
            </h2>
            <p className="text-slate-600 dark:text-slate-300 mt-6 leading-relaxed">
              Model accuracy relies heavily on robust data. DeepFER model variants are trained on the standard FER2013 dataset published during the ICML 2013 workshop.
            </p>
            <p className="text-slate-600 dark:text-slate-300 mt-4 leading-relaxed font-medium">
              Key numbers behind the dataset:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4 text-slate-600 dark:text-slate-300 text-sm">
              <li><strong>35,887</strong> total grayscale images of size 48x48.</li>
              <li><strong>28,709</strong> training directory samples.</li>
              <li><strong>3,589</strong> public testing set directories.</li>
              <li><strong>3,589</strong> private evaluation test vectors.</li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-3xl bg-white/10 dark:bg-black/30 border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl"
          >
            <h3 className="font-display font-bold text-2xl mb-6">Our Technology Stack</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'FastAPI', type: 'REST Python Service' },
                { name: 'TensorFlow 2', type: 'Inference Engine' },
                { name: 'OpenCV', type: 'Computer Vision' },
                { name: 'React 18', type: 'SPA View Controller' },
                { name: 'Tailwind CSS', type: 'UI System' },
                { name: 'Framer Motion', type: 'Animations' },
              ].map((tech, idx) => (
                <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col justify-between">
                  <span className="font-display font-extrabold text-indigo-600 dark:text-cyan-400">{tech.name}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs mt-1">{tech.type}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </section>

      {/* CTA Button Block */}
      <section className="py-24 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto p-12 md:p-16 rounded-3xl bg-gradient-to-tr from-indigo-500/10 via-purple-500/5 to-pink-500/10 dark:from-cyan-400/10 dark:via-indigo-500/5 dark:to-purple-500/10 border border-indigo-500/20 dark:border-cyan-400/20 shadow-2xl backdrop-blur-md"
        >
          <h2 className="font-display font-black text-3xl md:text-5xl leading-tight">
            Analyze Facial Expressions Now
          </h2>
          <p className="text-slate-600 dark:text-slate-300 mt-6 leading-relaxed max-w-2xl mx-auto">
            Experience our sub-second local CNN classification accuracy directly from your device.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Link to="/upload" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-cyan-500 dark:to-indigo-600 text-white rounded-2xl font-bold shadow-xl shadow-indigo-500/20"
              >
                Upload File <FiArrowRight className="w-5 h-5" />
              </motion.button>
            </Link>
            <Link to="/live" className="w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 text-slate-800 dark:text-white rounded-2xl font-bold backdrop-blur-md hover:bg-white/20"
              >
                Go Live Camera
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
