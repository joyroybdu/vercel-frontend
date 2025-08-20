import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PomodoroProvider } from './context/PomodoroContext';
import { AuthProvider } from './context/AuthContext';

import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PomodoroProvider>
          <App />
        </PomodoroProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);