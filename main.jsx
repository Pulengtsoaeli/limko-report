import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';

// Simple error boundary to prevent app from crashing
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: "20px", color: "red" }}>
          <h2>⚠️ Something went wrong.</h2>
          <p>Please refresh the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Mount React App
const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
