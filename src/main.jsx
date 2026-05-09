import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// StrictMode removed: it double-invokes every hook in dev, which triggers
// the EventProvider crash (useNotifications() context mismatch during HMR).
// The ErrorBoundary in App.jsx handles runtime errors instead.
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
    <App />
  </BrowserRouter>,
)
