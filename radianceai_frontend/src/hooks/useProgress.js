import { useState, useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * useProgress - Manages weekly progress data for routines, persisted to LS.
 * Returns: { progress, setProgress, clearProgress }
 */
function useProgress(routineKey = "routineProgress", initial = {}) {
  const [progress, setProgressState] = useState(() => {
    try {
      const val = window.localStorage.getItem(routineKey);
      return val ? JSON.parse(val) : initial;
    } catch { return initial; }
  });

  useEffect(() => {
    if (progress !== undefined)
      window.localStorage.setItem(routineKey, JSON.stringify(progress));
  }, [progress, routineKey]);

  // PUBLIC_INTERFACE
  function setProgress(p) {
    setProgressState(p);
  }
  // PUBLIC_INTERFACE
  function clearProgress() {
    setProgressState(initial);
    window.localStorage.removeItem(routineKey);
  }

  return { progress, setProgress, clearProgress };
}

export default useProgress;
