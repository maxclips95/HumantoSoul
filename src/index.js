import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './i18n'; // Import i18n config
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';

import axios from 'axios';

import { HelmetProvider } from 'react-helmet-async';

// Backend URL: api.humantosoul.com in production, localhost:5000 in dev
const API_BASE = process.env.NODE_ENV === 'production'
  ? 'https://api.humantosoul.com'
  : 'http://localhost:5000';

// Set axios base URL for all components using axios
axios.defaults.baseURL = API_BASE;

// Expose for components using fetch() directly
window.API_BASE = API_BASE;

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
