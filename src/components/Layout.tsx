import { Link, NavLink, Outlet } from 'react-router'
import { EmergencyBar } from './EmergencyBar'
import { Logo } from './Logo'
import { useRouteFocus } from '../lib/route-focus'
import { formatDateBR } from '../lib/provenance-ui'
import { dataset } from '../data/units'

/* Nav items repeat the coral motif on the active state (Etapa Visual 3 /
   B1): a 2px coral border-bottom (the brand's coral dot stretched into a
   line). Inactive items keep a transparent border of equal weight so the
   active/inactive heights match — no layout jitter on selection. */
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-touch items-center border-b-2 px-2 pt-0.5 text-label text-primary transition-card ${
    isActive ? 'border-accent font-semibold' : 'border-transparent hover:border-edge'
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

      <header className="border-b border-edge bg-surface">
        {/* Compact: one row on every viewport; the dev-version badge moved
            to the home intro (Etapa Visual 2 / B2). py-2 + the wordmark's
            own touch target keeps the bar around 56px. */}
        <div className="mx-auto flex w-full max-w-screen-lg items-center gap-3 px-4 py-2">
          <Link
            to="/"
            aria-label="navegador sus Erechim — página inicial"
            className="flex min-h-touch items-center"
          >
            <Logo />
          </Link>
          <nav aria-label="Seções do guia" className="ms-auto flex gap-1">
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
