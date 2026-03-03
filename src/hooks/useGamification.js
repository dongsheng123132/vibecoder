import { useState, useEffect, useCallback, useRef } from 'react';

const STORE_KEY = 'gamification';
const XP_PER_COMMAND = 10;
const COMBO_TIMEOUT_MS = 5000; // 5 seconds to keep combo alive

function xpForLevel(level) {
  return level * 100; // XP needed to reach next level
}

function getLevelTitle(level) {
  if (level >= 99) return 'VibeMaster';
  if (level >= 80) return 'CyberLord';
  if (level >= 60) return 'CodeWizard';
  if (level >= 40) return 'ByteKnight';
  if (level >= 20) return 'VibeRunner';
  if (level >= 10) return 'CodePilot';
  if (level >= 5) return 'Rookie';
  return 'Newbie';
}

function getDefaultData() {
  return {
    xp: 0,
    level: 1,
    combo: 0,
    maxCombo: 0,
    streak: 0,
    lastActiveDate: null,
  };
}

export function useGamification() {
  const [data, setData] = useState(getDefaultData());
  const [combo, setCombo] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const comboTimer = useRef(null);

  useEffect(() => {
    if (!window.electronAPI) return;
    window.electronAPI.storeGet(STORE_KEY, getDefaultData()).then((saved) => {
      if (saved) {
        // Check streak
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        let streak = saved.streak || 0;
        if (saved.lastActiveDate === yesterday) {
          // streak continues
        } else if (saved.lastActiveDate !== today) {
          streak = 0; // reset streak
        }
        setData({ ...saved, streak });
      }
    });
  }, []);

  const persist = useCallback((newData) => {
    if (window.electronAPI) {
      window.electronAPI.storeSet(STORE_KEY, newData);
    }
  }, []);

  const addXP = useCallback(() => {
    // Bump combo
    setCombo((prev) => {
      const next = prev + 1;
      // Reset combo timer
      if (comboTimer.current) clearTimeout(comboTimer.current);
      comboTimer.current = setTimeout(() => setCombo(0), COMBO_TIMEOUT_MS);
      return next;
    });

    setData((prev) => {
      const today = new Date().toISOString().slice(0, 10);
      let newXP = prev.xp + XP_PER_COMMAND;
      let newLevel = prev.level;
      let leveled = false;

      // Check level up
      while (newXP >= xpForLevel(newLevel) && newLevel < 99) {
        newXP -= xpForLevel(newLevel);
        newLevel++;
        leveled = true;
      }

      // Update streak
      let streak = prev.streak;
      if (prev.lastActiveDate !== today) {
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
        streak = prev.lastActiveDate === yesterday ? streak + 1 : 1;
      }

      if (leveled) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2000);
      }

      const next = {
        ...prev,
        xp: newXP,
        level: newLevel,
        maxCombo: Math.max(prev.maxCombo, combo + 1),
        streak,
        lastActiveDate: today,
      };
      persist(next);
      return next;
    });
  }, [combo, persist]);

  const xpProgress = data.xp / xpForLevel(data.level);
  const levelTitle = getLevelTitle(data.level);

  return {
    ...data,
    combo,
    xpProgress,
    levelTitle,
    showLevelUp,
    addXP,
  };
}
