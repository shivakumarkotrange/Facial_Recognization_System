// About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { FiLayers, FiDatabase, FiCompass, FiCpu } from 'react-icons/fi';

export default function About() {
  const sections = [
    {
      icon: <FiCompass className="w-6 h-6" />,
      title: 'Project Purpose & Vision',
      content: 'DeepFER (Facial Emotion Recognition Deep) was developed to demonstrate the capability of modern web applications combined with state-of-the-art deep learning architectures. By conducting video frame processing asynchronously in the background, we create an interactive, low-latency expression tracking interface that can serve fields such as healthcare monitoring, user interface testing, education analytics, and driver attention tracking.'
    },
    {
      icon: <FiCpu className="w-6 h-6" />,
      title: 'Optimized Convolutional Neural Network (CNN)',
      content: 'Our CNN classifier is designed specifically to capture features at different scale levels. The architecture consists of multiple sequential convolutional layers (Conv2D) to extract raw edges, textures, and shape highlights, followed by BatchNormalization to stabilize backpropagation gradients. MaxPooling layers pool visual representations to prevent spatial translation variances. Finally, Dropout layers block overfitting and force Dense layers to make generalization decisions. Output classes are computed using a Softmax activator.',
      code: `model = Sequential([
  Input(shape=(48, 48, 1)),
  Conv2D(64, (3, 3), padding="same", activation="relu"),
  BatchNormalization(),
  MaxPooling2D(pool_size=(2, 2)),
  Dropout(0.25),
  # Sequential conv blocks ...
  Flatten(),
  Dense(512, activation="relu"),
  BatchNormalization(),
  Dropout(0.5),
  Dense(7, activation="softmax")
])`
    },
    {
      icon: <FiDatabase className="w-6 h-6" />,
      title: 'Dataset Validation: FER2013',
      content: 'DeepFER models are validated using the FER2013 dataset. Releasing in 2013, the dataset contains 35,887 gray pixel maps, categorized into 7 different emotions: Angry, Disgust, Fear, Happy, Sad, Surprise, and Neutral. Since expressions in real life are highly variable, testing models on these directories provides a robust yardstick to check accuracy limits.'
    },
    {
      icon: <FiLayers className="w-6 h-6" />,
      title: 'Future Scope',
      content: 'Future upgrades to DeepFER aim to implement multi-face bounding box tracking simultaneously, visual sentiment timeline logging over extended sessions, integration of advanced transformer backbones (like Vision Transformers) for deeper micro-expression details, and edge-device compilation via TensorFlow.js to execute complete model feeds locally inside user browsers without hitting server REST APIs.'
    }
  ];

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h1 className="font-display font-black text-4xl md:text-5xl text-slate-800 dark:text-white">
          About <span className="bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-cyan-400 dark:to-indigo-500 bg-clip-text text-transparent">DeepFER</span>
        </h1>
        <p className="text-sm mt-3 text-slate-500 dark:text-slate-400">
          Learn about our underlying models, training data parameters, and structural design choices.
        </p>
      </div>

      {/* Grid List */}
      <div className="space-y-12">
        {sections.map((sec, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="p-8 rounded-3xl bg-white/40 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row gap-6"
          >
            {/* Left Side: Icon block */}
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500/10 to-purple-500/10 dark:from-cyan-400/10 dark:to-indigo-500/10 border border-indigo-500/20 dark:border-cyan-400/20 flex items-center justify-center text-indigo-600 dark:text-cyan-400 flex-shrink-0">
              {sec.icon}
            </div>

            {/* Right Side: Description content */}
            <div className="flex-1 space-y-4">
              <h3 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-100">
                {sec.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                {sec.content}
              </p>
              {sec.code && (
                <pre className="p-4 rounded-2xl bg-black/40 text-slate-300 font-mono text-xs overflow-x-auto leading-relaxed border border-white/5">
                  <code>{sec.code}</code>
                </pre>
              )}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
}
