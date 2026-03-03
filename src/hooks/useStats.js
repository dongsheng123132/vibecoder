import { useState, useEffect, useCallback } from 'react';

const STORE_KEY = 'commandStats';

function todayKey() {
  return new Date().toISOString().slice(0, 10); // "2026-03-02"
}

function getDefaultStats() {
  return {
    totalCommands: 0,
    daily: {},         // { "2026-03-02": 15 }
    commandFreq: {},   // { "继续": 12, "好的": 8 }
    hourly: {},        // { "14": 5 } — commands per hour
    lastUsed: null,
  };
}

export function useStats() {
  const [stats, setStats] = useState(getDefaultStats());

  // Load from electron-store on mount
  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.storeGet(STORE_KEY, getDefaultStats()).then((saved) => {
      if (saved) setStats(saved);
    });
  }, []);

  // Persist whenever stats change
  const persist = useCallback((newStats) => {
    if (window.electronAPI) {
      window.electronAPI.storeSet(STORE_KEY, newStats);
    }
  }, []);

  const recordCommand = useCallback((commandText) => {
    setStats((prev) => {
      const day = todayKey();
      const hour = String(new Date().getHours());
      const next = {
        ...prev,
        totalCommands: prev.totalCommands + 1,
        daily: { ...prev.daily, [day]: (prev.daily[day] || 0) + 1 },
        commandFreq: { ...prev.commandFreq, [commandText]: (prev.commandFreq[commandText] || 0) + 1 },
        hourly: { ...prev.hourly, [hour]: (prev.hourly[hour] || 0) + 1 },
        lastUsed: Date.now(),
      };
      persist(next);
      return next;
    });
  }, [persist]);

  // Get last 7 days data for chart
  const getLast7Days = useCallback(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({
        date: key.slice(5), // "03-02"
        count: stats.daily[key] || 0,
      });
    }
    return days;
  }, [stats]);

  // Top 5 commands
  const getTop5 = useCallback(() => {
    return Object.entries(stats.commandFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([text, count]) => ({ text: text.slice(0, 15), count }));
  }, [stats]);

  const todayCount = stats.daily[todayKey()] || 0;

  return {
    stats,
    todayCount,
    recordCommand,
    getLast7Days,
    getTop5,
  };
}
