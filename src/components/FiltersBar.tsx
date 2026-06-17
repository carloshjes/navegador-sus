/**
 * Active-filters indicator bar — Etapa Visual 5 / B + E.
 *
 * B: shows each active filter as its OWN removable pill, so the citizen
 *    sees what's narrowing the list and can drop one chip without
 *    scrolling back to the right group. The pill shape (kit-derived,
 *    §9.2) is now reserved for these citizen-made choices.
 * E: on mobile (< lg:) the bar sticks to the top while scrolling so the
 *    count and the chip set stay reachable. On lg+ the bar sits naturally
 *    above the results column of the 2-column directory grid.
 *
 * The count's full stop is the coral motif (kit §C2): the same brand mark
 * that closes the hero title closes the count number.
 */
export interface ActiveFilter {
  /** Stable React key. Also the URL-param name in our DirectoryPage. */
  key: string
  /** PT-BR text shown inside the pill (e.g. "Tipo: UBS"). */
  label: string
  onRemove: () => void
}

interface FiltersBarProps {
  count: number
  activeFilters: readonly ActiveFilter[]
  onClearAll: () => void
}

/* Small × glyph for the per-chip remove button. Inline SVG mirrors Tabler's
   `ti-x` and inherits the chip's text color via `currentColor`. */
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
        <span aria-hidden="true" className="text-accent">
          .
        </span>
      </div>

      {activeFilters.map((filter) => (
        /* Brand-interaction tokens (primary-soft/primary-ink), NOT the
           confidence tokens — the teal pill marks a choice the citizen made,
           not the state of the data (kit §9.2). Same hue as the confidence
           seal by design, but read semantically as interaction. */
        <span
          key={filter.key}
          className="inline-flex items-center gap-1 rounded-pill bg-primary-soft py-1 pe-1 ps-3 text-meta font-medium text-primary-ink"
        >
          {filter.label}
          <button
            type="button"
            onClick={filter.onRemove}
            aria-label={`Remover filtro: ${filter.label}`}
            className="inline-flex size-7 items-center justify-center rounded-full hover:bg-primary/10"
          >
            <XGlyph />
          </button>
        </span>
      ))}

      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearAll}
          className="ms-auto text-[12px] font-semibold text-primary hover:underline"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
