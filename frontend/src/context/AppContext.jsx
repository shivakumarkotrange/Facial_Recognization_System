import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();
const DetectionContext = createContext();

// ── Theme Provider ──────────────────────────────────────────────────────────
export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('deepfer-theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('deepfer-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);

// ── Detection History Provider ──────────────────────────────────────────────
export function DetectionProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('deepfer-history');
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  const addDetection = (entry) => {
    const newEntry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...entry,
    };
    setHistory(prev => {
      const updated = [newEntry, ...prev].slice(0, 100); // keep last 100
      localStorage.setItem('deepfer-history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('deepfer-history');
  };

  // Compute emotion distribution stats
  const stats = history.reduce((acc, item) => {
    const emotion = item.emotion?.toLowerCase() || 'neutral';
    acc[emotion] = (acc[emotion] || 0) + 1;
    return acc;
  }, {});

  return (
    <DetectionContext.Provider value={{ history, addDetection, clearHistory, stats, totalDetections: history.length }}>
      {children}
    </DetectionContext.Provider>
  );
}

export const useDetection = () => useContext(DetectionContext);
