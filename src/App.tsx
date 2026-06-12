import { Route, Routes } from 'react-router'
import { Layout } from './components/Layout'
import { DirectoryPage } from './pages/DirectoryPage'
import { UnitDetailPage } from './pages/UnitDetailPage'
import { WhereToGoPage } from './pages/WhereToGoPage'
import { NotFoundPage } from './pages/NotFoundPage'

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
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
