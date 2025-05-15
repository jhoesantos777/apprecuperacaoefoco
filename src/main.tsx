
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { IrmandadeProvider } from './contexts/IrmandadeContext.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <IrmandadeProvider>
        <App />
      </IrmandadeProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
