import { useState, useEffect } from "react";

// PUBLIC_INTERFACE
/**
 * useRoutine - Manages personalized routine (morning/night), linked to quiz answers.
 * - Returns routine object { steps: [...] }
 * - Saves to localStorage["savedRoutine"], or can generate on demand.
 */
function useRoutine(defaultRoutine = null) {
  const STORAGE_KEY = "savedRoutine";
  // Saved routine
  const [routine, setRoutineState] = useState(() => {
    try {
      const val = window.localStorage.getItem(STORAGE_KEY);
      return val ? JSON.parse(val) : defaultRoutine;
    } catch {
      return defaultRoutine;
    }
  });

  useEffect(() => {
    if (routine)
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(routine));
  }, [routine]);

  // PUBLIC_INTERFACE
  function setRoutine(newRoutine) {
    setRoutineState(newRoutine);
  }
  // PUBLIC_INTERFACE
  function clearRoutine() {
    setRoutineState(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return { routine, setRoutine, clearRoutine };
}

export default useRoutine;
