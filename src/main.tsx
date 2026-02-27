import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ContextSocketProvider } from './context/context-socket'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextSocketProvider>
      <App />
    </ContextSocketProvider>
  </StrictMode>,
)
