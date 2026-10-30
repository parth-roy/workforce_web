import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

const rootEl = document.getElementById('root')

if (rootEl && rootEl.hasChildNodes()) {
  hydrateRoot(
    rootEl,
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>,
  )
} else if (rootEl) {
  createRoot(rootEl).render(
    <StrictMode>
      <HelmetProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </HelmetProvider>
    </StrictMode>,
  )
}
