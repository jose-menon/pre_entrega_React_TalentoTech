import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { CarritoApp } from './CarritoApp.jsx'
import { HelmetProvider } from 'react-helmet-async'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <HelmetProvider>
  <StrictMode>
    <CarritoApp />
  </StrictMode>
  </HelmetProvider>
  </BrowserRouter>
)
