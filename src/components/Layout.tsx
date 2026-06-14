import { Link, NavLink, Outlet } from 'react-router'
import { EmergencyBar } from './EmergencyBar'
import { Logo } from './Logo'
import { useRouteFocus } from '../lib/route-focus'
import { formatDateBR } from '../lib/provenance-ui'
import { dataset } from '../data/units'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-touch items-center rounded-md px-3 text-label text-primary underline-offset-4 hover:underline ${
    isActive ? 'underline' : ''
  }`

/** App chrome shared by every route; pages render into <Outlet />. */
export function Layout() {
  useRouteFocus()

  return (
    /* pb reserves room for the fixed EmergencyBar so content never hides
       behind it (the bar itself handles the iOS safe area). */
    <div className="flex min-h-dvh flex-col pb-14">
      {/* Keyboard/screen-reader users can jump straight to content. */}
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-surface focus:px-4 focus:py-2 focus:font-semibold focus:text-primary"
      >
        Pular para o conteúdo
      </a>

      <header className="border-b border-edge bg-surface">
        <div className="mx-auto flex w-full max-w-screen-md flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3">
          <Link
            to="/"
            aria-label="navegador sus Erechim — página inicial"
            className="flex min-h-touch items-center"
          >
            <Logo />
          </Link>
          <p className="rounded-pill border border-border-strong px-3 py-0.5 text-meta text-ink-muted">
            versão em desenvolvimento
          </p>
          <nav aria-label="Seções do guia" className="ms-auto flex gap-1">
            <NavLink to="/mapa" className={navLinkClass}>
              Mapa
            </NavLink>
            <NavLink to="/onde-ir" className={navLinkClass}>
              Onde ir?
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="conteudo" className="mx-auto w-full max-w-screen-md grow px-4 py-6">
        <Outlet />
      </main>

      <footer className="border-t border-edge bg-surface">
        <div className="mx-auto w-full max-w-screen-md px-4 py-6 text-ink-muted">
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
