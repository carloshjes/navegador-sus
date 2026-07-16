/**
 * Active-filters indicator bar — Etapa Visual 5 / B + E.
 *
 * B: shows each active filter as its own removable text action, so the
 *    citizen sees what narrows the list and can remove one choice without
 *    scrolling back to its group. The list treatment avoids rebuilding a
 *    second wall of pills above the results.
 * E: on mobile (< lg:) the bar sticks to the top while scrolling so the
 *    count and active-choice actions stay reachable. On lg+ the bar sits naturally
 *    above the results column of the 2-column directory grid.
 *
 * The count's full stop stays in the primary family: the same restrained
 * brand mark that closes the hero title closes the count number.
 */
export interface ActiveFilter {
  /** Stable React key. Also the URL-param name in our DirectoryPage. */
  key: string
  /** PT-BR text shown in the removable action (e.g. "Tipo: UBS"). */
  label: string
  onRemove: () => void
}

interface FiltersBarProps {
  count: number
  activeFilters: readonly ActiveFilter[]
  onClearAll: () => void
}

/* Small × glyph for each removable filter action. Inline SVG mirrors
   Tabler's `ti-x` and inherits the action's text color via `currentColor`. */
function XGlyph() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}

export function FiltersBar({ count, activeFilters, onClearAll }: FiltersBarProps) {
  const hasActiveFilters = activeFilters.length > 0
  return (
    /* Mobile sticky: -mx-4 px-4 lets the bar bleed to the edges of <main>'s
       horizontal padding so the bg-bg "seal" is visually flush. lg:* reverts
       to a static, transparent strip inside the desktop grid column. */
    <div className="sticky top-0 z-10 -mx-4 mb-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-edge bg-bg px-4 py-2 lg:static lg:z-auto lg:mx-0 lg:bg-transparent lg:px-0 lg:py-0 lg:pb-3">
      <div className="font-display text-label font-bold text-ink">
        {count} {count === 1 ? 'resultado' : 'resultados'}
        <span aria-hidden="true" className="text-primary-ink">
          .
        </span>
      </div>

      {hasActiveFilters && (
        <span className="text-meta text-ink-muted">Filtros ativos:</span>
      )}

      {activeFilters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={filter.onRemove}
          aria-label={`Remover filtro: ${filter.label}`}
          className="inline-flex min-h-touch items-center gap-1 px-1 text-meta font-semibold text-primary hover:underline"
        >
          <span>{filter.label}</span>
          <span
            aria-hidden="true"
            className="inline-flex size-6 items-center justify-center rounded-full"
          >
            <XGlyph />
          </span>
        </button>
      ))}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="ms-auto inline-flex min-h-touch items-center text-meta font-semibold text-primary hover:underline"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
