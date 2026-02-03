import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n'; // Import i18n config
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import axios from 'axios';

import { HelmetProvider } from 'react-helmet-async';

// Set default base URL for API requests - environment aware
// In production (build), uses relative URLs (same origin)
// In development, uses localhost:5000
axios.defaults.baseURL = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:5000';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);

// If you want to measure performance, pass a function
reportWebVitals();
