import { useSearchParams } from 'react-router'
import { usePageTitle } from '../lib/route-focus'
import { UnitsMap } from '../components/map/UnitsMap'

/**
 * Map page. This module (and Leaflet with it) is lazy-loaded from App, so
 * the home never pays its weight. The directory listing remains the full,
 * equivalent path for anyone who can't or won't use the map.
 */
export default function MapPage() {
  usePageTitle('Mapa das unidades de saúde')
  const [searchParams] = useSearchParams()
  const focusId = searchParams.get('focus')

  return (
    <>
      <h1 id="page-title" tabIndex={-1} className="font-display text-display-lg">
        Mapa das unidades de saúde
      </h1>
      <p className="mt-2 text-ink-muted">
        Pontos da rede pública de atendimento. A localização exata de algumas unidades
        ainda está em verificação — confirme por telefone antes de ir.
      </p>

      {/* Legend: meaning travels by text, not color alone (WCAG 1.4.1). */}
      <ul
        className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm"
        aria-label="Legenda do mapa"
      >
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block size-3 rounded-full bg-primary"
          />
          Atende ao público
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block size-3 rounded-full bg-conf-warn"
          />
          Informações em verificação
        </li>
        <li className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="inline-block size-3 rounded-full bg-ink-muted"
          />
          Em construção
        </li>
      </ul>

      <div className="mt-4 h-[65vh] min-h-80 overflow-hidden rounded-lg border border-edge">
        <UnitsMap focusId={focusId} />
      </div>

      <p className="mt-3 text-sm text-ink-muted">
        Prefere uma lista? O{' '}
        <a href="/" className="text-primary underline underline-offset-4">
          diretório de unidades
        </a>{' '}
        traz as mesmas unidades com busca e filtros.
      </p>
    </>
  )
}
