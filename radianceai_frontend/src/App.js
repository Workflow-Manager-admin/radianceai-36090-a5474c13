import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
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

function App() {
  // PUBLIC_INTERFACE
  // Main skeleton with routing
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main style={{ paddingTop: '80px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/recommendations" element={<Recommendations />} />
            <Route path="/routine" element={<RoutineBuilder />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/progress" element={<ProgressTracker />} />
            <Route path="/weather" element={<WeatherSuggestions />} />
            <Route path="/email" element={<EmailFeatures />} />
            <Route path="/geolocation" element={<Geolocation />} />
            <Route path="/chat" element={<Chatbot />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;