import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Suppress benign ResizeObserver loop limit errors
if (typeof window !== 'undefined') {
  const isResizeObserverError = (msg: any) => {
    if (typeof msg !== 'string') return false;
    return msg.includes('ResizeObserver loop completed with undelivered notifications') ||
           msg.includes('ResizeObserver loop limit exceeded') ||
           msg.includes('ResizeObserver');
  };

  window.addEventListener('error', (e) => {
    if (isResizeObserverError(e.message)) {
      e.stopImmediatePropagation();
      e.preventDefault();
    }
  });

  const oldOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error) => {
    if (isResizeObserverError(message)) {
      return true; // Suppress default error handler and browser overlay
    }
    if (oldOnError) {
      return oldOnError(message, source, lineno, colno, error);
    }
    return false;
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

