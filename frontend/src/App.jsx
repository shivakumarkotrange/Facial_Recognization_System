// App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext';
import { DetectionProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Upload from './pages/Upload';
import LiveCamera from './pages/LiveCamera';
import Dashboard from './pages/Dashboard';
import Detect from './pages/Detect';
import About from './pages/About';

export default function App() {
  return (
    <ThemeProvider>
      <DetectionProvider>
      <Router>
        <div className="min-h-screen flex flex-col justify-between transition-colors duration-300 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100">
          
          {/* Glassmorphic Animated Grid overlay */}
          <div className="fixed inset-0 pointer-events-none z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
          </div>

          <Navbar />
          
          <main className="flex-grow z-10">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/live" element={<LiveCamera />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/detect" element={<Detect />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </main>
          
          <Footer />

          {/* Toast Notification system */}
          <Toaster
            position="bottom-right"
            toastOptions={{
              className: 'dark:bg-slate-900 dark:text-white dark:border dark:border-white/10 shadow-2xl rounded-2xl',
              duration: 3000,
            }}
          />
        </div>
      </Router>
      </DetectionProvider>
    </ThemeProvider>
  );
}
