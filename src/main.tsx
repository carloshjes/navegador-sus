import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
// Self-hosted fonts (kit §2). Only the latin + latin-ext subsets the kit
// asks for (cover PT-BR) and only the weights in use — so the bundle ships
// no Cyrillic/Greek/Vietnamese woff2 we never serve. Bundled into /assets by
// Vite, so the CSP stays font-src 'self' (no Google CDN) and the future
// offline-first PWA can cache them.
import '@fontsource/figtree/latin-600.css'
import '@fontsource/figtree/latin-700.css'
import '@fontsource/figtree/latin-ext-600.css'
import '@fontsource/figtree/latin-ext-700.css'
import '@fontsource/public-sans/latin-400.css'
import '@fontsource/public-sans/latin-500.css'
import '@fontsource/public-sans/latin-600.css'
import '@fontsource/public-sans/latin-ext-400.css'
import '@fontsource/public-sans/latin-ext-500.css'
import '@fontsource/public-sans/latin-ext-600.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
