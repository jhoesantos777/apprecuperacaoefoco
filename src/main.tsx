
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { IrmandadeProvider } from './contexts/IrmandadeContext.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <IrmandadeProvider>
      <App />
    </IrmandadeProvider>
  </React.StrictMode>,
)
