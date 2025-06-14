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
 * The rest of the file as before.
 * Main point: Ensure Home.js (homepage) is responsible for structure (hero, quiz modal, navbar already global),
 * and ProductList is called ONLY in its section (not as full-page route) on home.
 *
 * Recommendations/product page/etc. remain routed normally.
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
// Animated routes for all global pages (homepage = <Home /> for "/")
function AppRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <AppleFadeTransition>
              <Home />
            </AppleFadeTransition>
          }
        />
        <Route
          path="/quiz"
          element={
            <AppleFadeTransition>
              <Quiz />
            </AppleFadeTransition>
          }
        />
        <Route
          path="/recommendations"
          element={
            <AppleFadeTransition>
              <Recommendations />
            </AppleFadeTransition>
          }
        />
        <Route
          path="/routine"
          element={
            <AppleFadeTransition>
              <RoutineBuilder />
            </AppleFadeTransition>
          }
        />
        <Route
          path="/products"
          element={
            <AppleFadeTransition>
              <ProductList />
            </AppleFadeTransition>
          }
        />
        <Route
          path="/progress"
          element={
            <AppleFadeTransition>
              <ProgressTracker />
            </AppleFadeTransition>
          }
        />
        <Route
          path="/weather"
          element={
            <AppleFadeTransition>
              <WeatherSuggestions />
            </AppleFadeTransition>
          }
        />
        <Route
          path="/email"
          element={
            <AppleFadeTransition>
              <EmailFeatures />
            </AppleFadeTransition>
          }
        />
        <Route
          path="/geolocation"
          element={
            <AppleFadeTransition>
              <Geolocation />
            </AppleFadeTransition>
          }
        />
        <Route
          path="/chat"
          element={
            <AppleFadeTransition>
              <Chatbot />
            </AppleFadeTransition>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

// PUBLIC_INTERFACE
function App() {
  return (
    <Router>
      <div className="app">
        <OverlayDebugger />
        {/* TopNavBar is always visible and fixed at top */}
        <TopNavBar />
        <main
          style={{
            paddingTop: 75, // Slightly increased if navbar gains border/shadow or dev needs
            minHeight: "calc(100vh - 75px)",
            background: "var(--gradient-gray-bg)",
            transition: "padding-bottom 0.25s cubic-bezier(.27,1.36,.48,1), background 0.7s cubic-bezier(.45,1.45,.48,1)",
            willChange: "padding-bottom, background",
          }}
        >
          <AppRoutes />
        </main>
      </div>
    </Router>
  );
}

export default App;
