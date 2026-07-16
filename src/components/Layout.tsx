import { Link, NavLink, Outlet } from 'react-router'
import { EmergencyBar } from './EmergencyBar'
import { Logo } from './Logo'
import { useRouteFocus } from '../lib/route-focus'
import { formatDateBR } from '../lib/provenance-ui'
import { dataset } from '../data/units'

/* The active route becomes a page-colored wayfinding plate connected to the
   content below. Inactive routes stay white on the solid primary header and
   gain only a subtle white wash on hover. */
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `transition-control flex min-h-touch items-center justify-center rounded-t-sm px-1 text-label sm:px-2 ${
    isActive ? 'bg-bg font-semibold text-primary' : 'text-white hover:bg-white/10'
  }`

/** App chrome shared by every route; pages render into <Outlet />. */
export function Layout() {
  useRouteFocus()

  return (
    /* pb-bar reserves the EmergencyBar's height + the iOS safe-area inset
       (Etapa Visual 2 / A2) — content never hides behind the fixed bar. */
    <div className="flex min-h-dvh flex-col pb-bar">
      {/* Keyboard/screen-reader users can jump straight to content. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:font-semibold focus:text-primary"
      >
        Pular para o conteúdo
      </a>

      <header className="app-header h-header bg-primary">
        {/* Mobile gives the enlarged mark its own row and keeps all three nav
            labels intact. At sm+ both regions share one line. The explicit
            h-header utility stays paired with the map height calculation. */}
        <div className="mx-auto grid h-full w-full max-w-screen-lg grid-rows-[1fr_2.75rem] items-center px-2 sm:flex sm:gap-4 sm:px-4">
          <Link
            to="/"
            aria-label="navegador sus Erechim — página inicial"
            className="flex min-h-touch items-center justify-self-center sm:justify-self-auto"
          >
            <Logo />
          </Link>
          <nav
            aria-label="Seções do guia"
            className="grid w-full grid-cols-3 sm:ms-auto sm:flex sm:w-auto sm:self-end sm:gap-1"
          >
            {/* `end` is required on the index route — without it, NavLink
                would treat any path as a child of "/" and render Início as
                always-active. */}
            <NavLink to="/" end className={navLinkClass}>
              Início
            </NavLink>
            <NavLink to="/mapa" className={navLinkClass}>
              Mapa
            </NavLink>
            <NavLink to="/onde-ir" className={navLinkClass}>
              Onde ir?
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="conteudo" className="mx-auto w-full max-w-screen-lg grow px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-edge bg-surface">
        <div className="mx-auto w-full max-w-screen-lg px-4 py-6 text-ink-muted">
          <p>
            Este app informa e direciona; <strong>não substitui</strong> os canais
            oficiais. Em caso de divergência, vale a informação da unidade ou da
            Secretaria Municipal de Saúde.
          </p>
          <p className="mt-2 text-meta">
            Dados públicos (CNES/DataSUS e Prefeitura de Erechim) levantados em{' '}
            {formatDateBR(dataset.generatedAt)}.
          </p>
        </div>
      </footer>

      <EmergencyBar />
    </div>
  )
}
