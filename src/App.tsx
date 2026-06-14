import { lazy, Suspense } from 'react'
import { Link, Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DirectoryPage } from './pages/DirectoryPage'
import { UnitDetailPage } from './pages/UnitDetailPage'
import { WhereToGoPage } from './pages/WhereToGoPage'
import { NotFoundPage } from './pages/NotFoundPage'

// Lazy-loaded so Leaflet's weight stays out of the home bundle (it ships
// in its own chunk, fetched only when /mapa is opened).
const MapPage = lazy(() => import('./pages/MapPage'))

/**
 * Client-side routes. Cloudflare Pages serves index.html for unknown
 * paths (SPA fallback), so deep links like /unidade/:id resolve here.
 */
function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<DirectoryPage />} />
        <Route path="unidade/:id" element={<UnitDetailPage />} />
        <Route path="onde-ir" element={<WhereToGoPage />} />
        <Route
          path="mapa"
          element={
            <ErrorBoundary
              fallback={
                <div>
                  <h1 className="font-display text-display-lg">Mapa indisponível</h1>
                  <p className="mt-2 text-ink-muted">
                    Não foi possível carregar o mapa agora. O{' '}
                    <Link to="/" className="text-primary underline underline-offset-4">
                      diretório de unidades
                    </Link>{' '}
                    traz as mesmas unidades em lista.
                  </p>
                </div>
              }
            >
              <Suspense fallback={<p className="text-ink-muted">Carregando o mapa…</p>}>
                <MapPage />
              </Suspense>
            </ErrorBoundary>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
