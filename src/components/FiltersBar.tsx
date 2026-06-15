/**
 * Active-filters indicator bar (Etapa Visual 4 / B1). Sits above the card
 * grid: the count on the left, a teal "Limpar filtros" text-button on the
 * right when any filter is active. The bottom border separates this row
 * from the cards beneath.
 *
 * The count's full stop is the coral motif again (kit §C2): the same
 * brand mark that closes the hero title closes the count number.
 */
interface FiltersBarProps {
  count: number
  hasActiveFilters: boolean
  onClearFilters: () => void
}

export function FiltersBar({ count, hasActiveFilters, onClearFilters }: FiltersBarProps) {
  return (
    <div className="mb-4 flex items-baseline justify-between border-b border-edge pb-3">
      <div className="font-display text-[15px] font-bold text-ink">
        {count} {count === 1 ? 'unidade' : 'unidades'}
        <span aria-hidden="true" className="text-accent">
          .
        </span>
      </div>
      {hasActiveFilters && (
        <button
          type="button"
          onClick={onClearFilters}
          className="text-[12px] font-semibold text-primary hover:underline"
        >
          Limpar filtros
        </button>
      )}
    </div>
  )
}
