import { useSearchParams } from 'react-router'
import { usePageTitle } from '../lib/route-focus'
import { UnitsMap } from '../components/map/UnitsMap'

/**
 * Map page. This module (and Leaflet with it) is lazy-loaded from App, so
 * the home never pays its weight. The directory listing remains the full,
 * equivalent path for anyone who can't or won't use the map.
 *
 * Layout strategy (Etapa Visual 3 / A1): the whole page is a viewport-fit
 * flex column (.h-mappage = dvh − header − bar − safe-area). The title,
 * intro and legend sit at their natural sizes; the map gets `flex-1` and
 * absorbs the rest. The page itself doesn't scroll — so the EmergencyBar's
 * fixed overlay never covers any pins, on any phone height. The footer
 * note moved to the bottom of the page wrapper, just above the bar.
 */
export default function MapPage() {
  usePageTitle('Mapa das unidades de saúde')
  const [searchParams] = useSearchParams()
  const focusId = searchParams.get('focus')

  return (
    <div className="h-mappage -my-6 flex min-h-0 flex-col py-3">
      <h1 id="page-title" tabIndex={-1} className="font-display text-display">
        Mapa das unidades de saúde
      </h1>

      {/* Legend: meaning travels by text, not color alone (WCAG 1.4.1). */}
      <ul
        className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-meta"
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

      {/* min-h-0 lets the flex item shrink past its content min-height — the
          default for flex children is min-content, which would push the
          map past the bar on tall maps. flex-1 takes all leftover space. */}
      <div className="mt-3 min-h-0 flex-1 overflow-hidden rounded-lg border border-edge">
        <UnitsMap focusId={focusId} />
      </div>

      <p className="mt-2 text-meta text-ink-muted">
        Prefere uma lista? O{' '}
        <a href="/" className="text-primary underline underline-offset-4">
          diretório de unidades
        </a>{' '}
        traz as mesmas unidades com busca e filtros.
      </p>
    </div>
  )
}
