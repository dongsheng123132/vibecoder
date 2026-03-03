import { useState, useEffect, useCallback } from 'react';

export function useActiveWindow() {
  const [activeWindow, setActiveWindow] = useState(null);
  const [manualTool, setManualTool] = useState(null);

  useEffect(() => {
    if (!window.electronAPI) return;

    const cleanup = window.electronAPI.onActiveWindowChanged((info) => {
      setActiveWindow(info);
    });

    // Get initial value
    window.electronAPI.getLastActiveWindow().then((info) => {
      if (info) setActiveWindow(info);
    });

    return cleanup;
  }, []);

  const currentTool = manualTool || activeWindow?.tool || 'Terminal';

  const setOverrideTool = useCallback((tool) => {
    setManualTool(tool);
  }, []);

  const clearOverride = useCallback(() => {
    setManualTool(null);
  }, []);

  return {
    activeWindow,
    currentTool,
    manualTool,
    setOverrideTool,
    clearOverride,
  };
}
