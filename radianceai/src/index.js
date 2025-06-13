import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// PUBLIC_INTERFACE
/**
 * Main entry point for React application.
 * Renders the App component into the root DOM node.
 */
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
