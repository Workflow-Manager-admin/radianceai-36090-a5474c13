import React, { useState, useEffect } from "react";
import useLocalStorage from "../../hooks/useLocalStorage";
import { MotionWrapper, AppleFadeTransition } from "../../utils/animation";

/**
 * PUBLIC_INTERFACE
 * ProgressTracker: lets users log progress on their saved routine, track by week, see streaks and completion, and manage start dates.
 * LocalStorage for persistence; stubs for Firebase provided in code (commented).
 */

// Utility: days of week, date helpers
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
function getTodayISO() {
  return new Date().toISOString().slice(0, 10); // e.g. "2024-05-31"
}
function getLast7Days() {
  const arr = [];
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    arr.push(d.toISOString().slice(0, 10));
  }
  return arr;
}

// Constants: routine step meta (must match RoutineBuilder, but static copy is safe for display/tracking)
const ROUTINE_STEPS = [
  // Morning routine steps
  { key: "cleanser", label: "Cleanser", icon: "🧼", slot: "morning" },
  { key: "toner", label: "Toner", icon: "💧", slot: "morning" },
  { key: "serum", label: "Serum", icon: "🧪", slot: "morning" },
  { key: "moisturizer", label: "Moisturizer", icon: "🥛", slot: "morning" },
  { key: "sunscreen", label: "Sunscreen", icon: "🌞", slot: "morning" },
  // Night routine steps
  { key: "cleanser_night", label: "Cleanser (Night)", icon: "🧼", slot: "night" },
  { key: "treatment", label: "Treatment", icon: "💊", slot: "night" },
  { key: "night_serum", label: "Serum/Oil", icon: "🌙", slot: "night" },
  { key: "night_moisturizer", label: "Moisturizer (Night)", icon: "🥛", slot: "night" }
];

// Storage keys
const SAVED_ROUTINE_KEY = "savedRoutine";
const ROUTINE_PROGRESS_KEY = "routineProgress";

// Firebase stub
// const saveProgressToFirebase = (userId, progressObj) => {};
// const loadProgressFromFirebase = (userId) => {};

// Helpers
function defaultRoutineProgress(routine) {
  // For each step: {startDate: null, checked: {YYYY-MM-DD:bool,...} }
  const out = {};
  routine &&
    routine.steps &&
    routine.steps.forEach((s) => {
      out[s.key] = { startDate: null, checked: {} };
    });
  return out;
}

// --- Main component ---
const ProgressTracker = () => {
  // Load latest routine (saved from RoutineBuilder)
  const [routine, setRoutine] = useLocalStorage(SAVED_ROUTINE_KEY, null);
  // Each step: { startDate: date|null, checked: { 'YYYY-MM-DD': true/false } }
  const [progress, setProgress] = useLocalStorage(
    ROUTINE_PROGRESS_KEY,
    routine ? defaultRoutineProgress(routine) : {}
  );
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // On new routine loaded, reset progress if not matched
  useEffect(() => {
    if (routine && !progress[routine.steps[0]?.key]) {
      setProgress(defaultRoutineProgress(routine));
    }
    // eslint-disable-next-line
  }, [routine]);

  // Save routine to localStorage from RoutineBuilder output
  const saveCurrentRoutine = () => {
    // Assume user's personalized routine is in localStorage under 'routineProducts' or similar
    // For demo: fake format must be compatible with {steps:[{key, label, ...},...]}
    if (!window.localStorage.getItem("routineProducts")) {
      alert("No routine found to save. Build your routine first!");
      return;
    }
    // Synthesize routine object from routineProducts keys and meta
    const routineProducts = JSON.parse(window.localStorage.getItem("routineProducts"));
    const steps = ROUTINE_STEPS.filter((s) => Object.keys(routineProducts).includes(s.key));
    setRoutine({ steps });
    setProgress(defaultRoutineProgress({ steps }));
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 1200);
  };

  // User sets product/step START date
  const setStartDate = (stepKey, date) => {
    setProgress((prev) => ({
      ...prev,
      [stepKey]: {
        ...(prev[stepKey] || {}),
        startDate: date
      }
    }));
  };

  // Toggle completion checkbox
  const toggleStepCheck = (stepKey, date) => {
    setProgress((prev) => ({
      ...prev,
      [stepKey]: {
        ...prev[stepKey],
        checked: {
          ...(prev[stepKey]?.checked || {}),
          [date]: !prev[stepKey]?.checked?.[date]
        }
      }
    }));
  };

  // Calculate stats
  function computeStatistics() {
    if (!routine || !routine.steps) return { streak: 0, percent: 0 };
    const days = getLast7Days();
    let total = 0,
      complete = 0;
    routine.steps.forEach((step) => {
      days.forEach((d) => {
        total += 1;
        if (progress[step.key]?.checked?.[d]) complete += 1;
      });
    });
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      const d = days[i];
      let allStepsDone = routine.steps.every((step) => progress[step.key]?.checked?.[d]);
      if (allStepsDone) streak++;
      else break;
    }
    return {
      streak,
      percent: total ? Math.round((complete / total) * 100) : 0
    };
  }

  // If no saved routine, prompt to save from RoutineBuilder
  if (!routine || !routine.steps || routine.steps.length === 0) {
    return (
      <section className="container" style={{ minHeight: 340, paddingTop: 33, textAlign: "center" }}>
        <AppleFadeTransition>
          <h2 style={{ color: "#2050aa" }}>Progress Tracker</h2>
          <div style={{ color: "#77a6ed", marginTop: 16, fontSize: 17.5, marginBottom: 26 }}>
            Save your personalized routine in the Routine Builder to start tracking progress.
          </div>
          <a href="/routine">
            <button className="btn btn-large" style={{ background: "linear-gradient(90deg,#2050aa 60%,#77a6ed 100%)", color: "#fff", borderRadius: 14, fontWeight: 700, fontSize: "1.1rem" }}>
              Go to Routine Builder
            </button>
          </a>
        </AppleFadeTransition>
      </section>
    );
  }

  // Render tracker grid
  const days = getLast7Days();
  const { streak, percent } = computeStatistics();

  return (
    <section className="container" style={{ maxWidth: 860, margin: "0 auto" }}>
      <AppleFadeTransition>
        <h2 style={{
          color: "#fadadd", fontWeight: 700, fontSize: "2.0rem", margin: "19px 0 8px", textAlign: "center"
        }}>
          Weekly Progress Tracker
        </h2>
        <div style={{ color: "#e7b3ff", textAlign: "center", fontSize: 17, margin: "0 0 12px 0" }}>
          Mark each completed step daily. Consistency is key for glowing skin!
        </div>
        {/* Weekday row */}
        <div style={{
          display: "flex", justifyContent: "space-between", maxWidth: 600, margin: "24px auto 0 auto",
          background: "rgba(255,255,255,0.04)", borderRadius: 13, padding: "7px 10px 6px 10px", fontWeight: 700,
          fontSize: 15.2, color: "#fadadd", letterSpacing: ".01em"
        }}>
          <div style={{ width: 130 }} /> {/* Spacer: step label column */}
          {days.map((d, i) => (
            <div key={d} style={{
              minWidth: 38, textAlign: "center", opacity: 0.93, fontWeight: (d === getTodayISO()) ? 700 : 500,
              color: (d === getTodayISO()) ? "#f339db" : "#fadadd"
            }}>
              {DAYS[new Date(d).getDay()]}<br /><span style={{ fontWeight: 500, fontSize: 12 }}>{d.slice(5)}</span>
            </div>
          ))}
        </div>
        {/* Tracker grid */}
        <MotionWrapper>
          <div style={{
            background: "rgba(255,255,255,0.035)", borderRadius: 16, boxShadow: "0 1px 12px #fadadd11",
            padding: "16px 10px 19px 10px", maxWidth: 600, margin: "0 auto", marginTop: 12
          }}>
            {routine.steps.map((step) => (
              <div key={step.key} style={{
                display: "flex", alignItems: "center", borderBottom: "1.5px solid #fadadd17",
                minHeight: 35, padding: "9px 0 5px 0"
              }}>
                {/* Step label and icon */}
                <div style={{
                  minWidth: 130, fontWeight: 600, color: "#fadadd", display: "flex", alignItems: "center", gap: 9
                }}>
                  <span style={{
                    fontSize: 20,
                    filter: "drop-shadow(0 1px 2px #fadaddb0)",
                  }}>{step.icon}</span>
                  {step.label || step.name}
                </div>
                {/* Days checkboxes */}
                {days.map((d) => (
                  <div key={d} style={{ textAlign: "center", minWidth: 38, margin: "0 2.5px" }}>
                    <input
                      type="checkbox"
                      checked={!!progress[step.key]?.checked?.[d]}
                      onChange={() => toggleStepCheck(step.key, d)}
                      aria-label={`Mark ${step.label} as done on ${d}`}
                      style={{
                        accentColor: "#f339db",
                        width: 18, height: 18, marginTop: 2, cursor: "pointer",
                      }}
                    />
                  </div>
                ))}
                {/* Start date selector */}
                <div style={{ marginLeft: 8 }}>
                  <input
                    type="date"
                    aria-label={`Select start date for ${step.label}`}
                    value={progress[step.key]?.startDate || ""}
                    onChange={e => setStartDate(step.key, e.target.value)}
                    style={{
                      border: "none", borderRadius: 7, padding: "2px 6px", fontSize: 13,
                      outline: "none", background: "#e7b3ff27", color: "#fff"
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </MotionWrapper>
        {/* Streak and stats */}
        <div style={{
          margin: "17px auto 12px auto",
          color: "#fadadd",
          textAlign: "center", fontSize: 15.9, fontWeight: 500
        }}>
          Progress: <span style={{ color: "#f339db", fontWeight: 700 }}>{percent}%</span> – 
          Weekly streak: <span style={{
            color: streak >= 3 ? "#f339db" : "#fadadd",
            fontWeight: 700
          }}>{streak} day{streak === 1 ? "" : "s"}</span>
        </div>
        {/* Save routine section */}
        <div style={{
          margin: "25px auto 0 auto", textAlign: "center"
        }}>
          <button
            className="btn btn-large"
            style={{
              background: "linear-gradient(90deg, #2050aa 60%, #77a6ed 100%)",
              color: "#27275e",
              fontWeight: 700,
              fontSize: "1.09rem",
              borderRadius: 14
            }}
            onClick={saveCurrentRoutine} 
          >
            Save My Current Routine Here
          </button>
          {showSaveSuccess && (
            <span style={{
              color: "#fadadd", marginLeft: 16, fontSize: 15.2,
              fontWeight: 600, background: "#e7b3ff24", borderRadius: 10, padding: "3px 10px"
            }}>
              Routine Saved!
            </span>
          )}
        </div>
        {/* (Firebase integration placeholder: see saveProgressToFirebase/loadProgressFromFirebase in code) */}
      </AppleFadeTransition>
    </section>
  );
};

export default ProgressTracker;

