import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { GlobalStateProvider } from './context/GlobalStateContext';

// DEBUG: Log potential critical errors at startup
(function () {
  window.onerror = function (message, source, lineno, colno, error) {
    document.body.innerHTML = "<pre style='color:#D2195B;padding:2em;background:#fff8fa;border-radius:12px;font-size:1.2em'>RUNTIME ERROR on startup:\n" +
      (message || '') + "\n" +
      (error && error.stack ? "\n" + error.stack : "") +
      "\nSource: " + (source || '') + " (" + lineno + ":" + colno + ")" +
      "</pre>";
    return false;
  };
  window.addEventListener('unhandledrejection', function(e) {
    document.body.innerHTML = "<pre style='color:#D2195B;padding:2em;background:#fff8fa;border-radius:12px;font-size:1.13em'>UNHANDLED PROMISE ERROR:\n" +
      (e.reason && e.reason.message ? e.reason.message : (e.reason || "")) +
      (e.reason && e.reason.stack ? ("\n" + e.reason.stack) : "") +
      "</pre>";
  });
})();
// PUBLIC_INTERFACE
// Basic error boundary component for runtime React errors
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You might log the error here
    this.setState({ error, errorInfo });
    // Optionally, send to some logging service
    // logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: 'center', color: '#D2195B', background: '#fff8fa' }}>
          <h2>Something went wrong.</h2>
          <details style={{ whiteSpace: 'pre-wrap', color: '#8e1694', fontSize: 13 }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <p>Please reload the page or contact support.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <GlobalStateProvider>
        <App />
      </GlobalStateProvider>
    </ErrorBoundary>
  </React.StrictMode>
);
