import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'; // All used symbols are current as of v6
import { AnimatePresence } from "framer-motion";
import './App.css';
import TopNavBar from './components/TopNavBar';
import Quiz from './features/quiz/Quiz';
import Recommendations from './features/recommendations/Recommendations';
import RoutineBuilder from './features/routine/RoutineBuilder';
import ProductList from './features/products/ProductList';
import ProgressTracker from './features/progress/ProgressTracker';
import WeatherSuggestions from './features/weather/WeatherSuggestions';
import EmailFeatures from './features/email/EmailFeatures';
import Geolocation from './features/geolocation/Geolocation';
import Chatbot from './features/chatbot/Chatbot';
import Home from './features/home/Home';
import { AppleFadeTransition } from "./utils/animation";

/**
 * DEEP UI ANALYSIS NOTES (2024-06-09)
 *
 * Examined for high z-index overlays, pointer-events, stacking and animation wrappers.
 * 
 * OVERLAY DEBUGGER: Temporary diagnostic overlay is present (OverlayDebugger): z-index: 99999, pointer-events: none.
 * - Harmless/helpful, does not block interactions. REMOVE when not debugging.
 * 
 * MAIN CONTAINER: <div className="app">
 * - min-height: 100vh; display: flex; flex-direction: column; pointer-events: auto !important (App.css)
 * 
 * MAIN <main> tag:
 * - pointer-events: auto !important (App.css)
 * - Used only for layout/padding, not positioning overlays.
 * 
 * ANIMATION WRAPPERS:
 * - AppleFadeTransition and motion wrappers use pointer-events: auto !important (App.css, utils/animation.js).
 * - Do not create overlays or passive layers with pointer-events: none.
 * 
 * NAVBARS:
 * - .top-navbar: z-index: 101, fixed top, pointer events enabled (App.css)
 * - .bottom-navbar: z-index: 121, fixed bottom, pointer events enabled (App.css)
 * 
 * MODALS/OVERLAYS:
 * - .quiz-modal-overlay: z-index: 4020, pointer-events: auto !important, semi-transparent color.
 *   This overlay only appears when quiz modal is open. It is visible and dismiss interaction is enabled (by pointer-events: auto and opacity).
 * 
 * No invisible overlays or accidental stacking found in App.js or its immediate containers/wrappers.
 * All overlays that appear (modal and debug overlay) have intentional pointer-events and stacking context.
 * 
 * No animation wrappers (AnimatePresence, AppleFadeTransition, motion.div) unexpectedly create overlays that would block clicks.
 * 
 * No unexpected pointer-events: none or high z-index elements in .app, main, navbars, overlay, or AppleFadeTransition.
 * 
 * If UI clicks are blocked: (a) Check for custom modals outside the above, (b) Confirm OverlayDebugger is removed, (c) Inspect .quiz-modal-overlay state and display.
 */
// End UI analysis notes

/**
 * Diagnostic Overlay: Temporarily add a visual overlay with high z-index and pointer-events to aid troubleshooting.
 * Remove/comment this component out after confirming/solving UI blocking bugs.
 */
const OverlayDebugger = () => {
  useEffect(() => {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.zIndex = '99999';
    overlay.style.pointerEvents = 'none'; // should never block clicks itself
    overlay.style.background =
      'repeating-linear-gradient(135deg, rgba(243,57,219,0.01), rgba(243,57,219,0.03) 16px, transparent 16px, transparent 32px)';
    overlay.style.border = '4px solid #f339db22';
    overlay.style.boxSizing = 'border-box';
    overlay.style.opacity = '0.55';
    overlay.setAttribute('data-debug','zindex');
    document.body.appendChild(overlay);
    return () => { document.body.removeChild(overlay); };
  }, []);
  return null;
};
// PUBLIC_INTERFACE
// AppRoutes: Handles animated route transitions globally
function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      {/* This key ensures AnimatePresence triggers on route change */}
      <Routes location={location} key={location.pathname}>
        <Route path="/"
          element={<AppleFadeTransition><Home /></AppleFadeTransition>}
        />
        <Route path="/quiz"
          element={<AppleFadeTransition><Quiz /></AppleFadeTransition>}
        />
        <Route path="/recommendations"
          element={<AppleFadeTransition><Recommendations /></AppleFadeTransition>}
        />
        <Route path="/routine"
          element={<AppleFadeTransition><RoutineBuilder /></AppleFadeTransition>}
        />
        <Route path="/products"
          element={<AppleFadeTransition><ProductList /></AppleFadeTransition>}
        />
        <Route path="/progress"
          element={<AppleFadeTransition><ProgressTracker /></AppleFadeTransition>}
        />
        <Route path="/weather"
          element={<AppleFadeTransition><WeatherSuggestions /></AppleFadeTransition>}
        />
        <Route path="/email"
          element={<AppleFadeTransition><EmailFeatures /></AppleFadeTransition>}
        />
        <Route path="/geolocation"
          element={<AppleFadeTransition><Geolocation /></AppleFadeTransition>}
        />
        <Route path="/chat"
          element={<AppleFadeTransition><Chatbot /></AppleFadeTransition>}
        />
        <Route path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </AnimatePresence>
  );
}

// PUBLIC_INTERFACE
// Main skeleton with persistent animated Apple-like top nav
function App() {
  // DEBUG: Temporarily mount z-index overlay visual checker to assist troubleshooting
  return (
    <Router>
      <div className="app">
        <OverlayDebugger />
        <TopNavBar />
        <main
          style={{
            paddingTop: 70,
            minHeight: "calc(100vh - 70px)",
            /* Inherit the gray gradient – ensures no solid/white bg on main region */
            background: "var(--gradient-gray-bg)",
            transition: "padding-bottom 0.25s cubic-bezier(.27,1.36,.48,1), background 0.7s cubic-bezier(.45,1.45,.48,1)",
            willChange: "padding-bottom, background",
          }}
        >
          <AppRoutes />
        </main>
        {/* BottomNavBar removed */}
      </div>
    </Router>
  );
}

export default App;
