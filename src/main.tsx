import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx'
import { ThemeProvider } from "./context/ThemeContext";
import './translations/i18n';
import "./styles/global.css";
import { BrowserRouter } from 'react-router-dom';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
