// UploadBox.jsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUploadCloud } from 'react-icons/fi';
import { motion } from 'framer-motion';

export default function UploadBox({ onFileSelected, selectedImage }) {
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles[0]) {
      onFileSelected(acceptedFiles[0]);
    }
  }, [onFileSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.bmp']
    },
    multiple: false
  });

  return (
    <div
      {...getRootProps()}
      className={`relative group rounded-3xl p-8 border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all duration-300 min-h-[300px] bg-white/5 dark:bg-black/10 backdrop-blur-md ${
        isDragActive
          ? 'border-indigo-500 bg-indigo-500/5 dark:border-cyan-400 dark:bg-cyan-400/5'
          : selectedImage
          ? 'border-slate-300 dark:border-slate-700'
          : 'border-slate-300 dark:border-slate-800 hover:border-indigo-500/50 dark:hover:border-cyan-400/50 hover:bg-white/10 dark:hover:bg-white/5'
      }`}
    >
      <input {...getInputProps()} />
      
      {selectedImage ? (
        <div className="relative w-full flex flex-col items-center gap-4">
          <div className="relative rounded-2xl overflow-hidden shadow-2xl max-h-[350px] border border-white/20">
            <img
              src={selectedImage}
              alt="Selected face to detect"
              className="max-h-[350px] object-contain block mx-auto rounded-2xl"
            />
            {/* Scan animation over preview */}
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none opacity-40 mix-blend-overlay" />
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            Click or drag another image to replace
          </p>
        </div>
      ) : (
        <div className="flex flex-col items-center text-center">
          <motion.div
            animate={isDragActive ? { y: -10 } : { y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-cyan-400/10 flex items-center justify-center text-indigo-600 dark:text-cyan-400 mb-6 group-hover:scale-105 transition-transform"
          >
            <FiUploadCloud className="w-8 h-8" />
          </motion.div>
          <h3 className="font-display font-extrabold text-xl text-slate-800 dark:text-slate-200">
            Drag & Drop image here
          </h3>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm max-w-xs">
            Supports JPEG, PNG, WEBP, and BMP up to 10MB
          </p>
          <span className="mt-6 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-white/5 hover:scale-102 transition-all">
            Browse files
          </span>
        </div>
      )}
    </div>
  );
}
