import { useId, useState } from 'react'
import { FilterChip } from './FilterChip'

/**
 * Family of chips with a "Mais ▾" disclosure for long lists (Etapa Visual 2 /
 * B5). The first `prioritySlots` chips are always visible; the rest hide
 * behind a button until the user opens them — keeps the directory from
 * becoming a wall of chips when neighborhoods or services are dozens. The
 * disclosure is a real `<button aria-expanded aria-controls>` so screen
 * readers narrate the state.
 *
 * `options` already arrives in display order (priority chips first); the
 * caller decides which slugs are "priority" by ordering them upfront. The
 * "Todos" chip is always rendered first when `allowAll` is true.
 */
interface Option<V extends string> {
  value: V
  label: string
}

interface FilterChipGroupProps<V extends string> {
  legend: string
  options: readonly Option<V>[]
  value: V | ''
  onChange: (value: V | '') => void
  /** Items kept visible; remaining ones go behind "Mais …". 0 = all visible. */
  prioritySlots?: number
  /** Label for the disclosure button, e.g. "Mais serviços", "Mais bairros". */
  moreLabel?: string
}

export function FilterChipGroup<V extends string>({
  legend,
  options,
  value,
  onChange,
  prioritySlots = 0,
  moreLabel = 'Mais opções',
}: FilterChipGroupProps<V>) {
  const reactId = useId()
  const moreId = `${reactId}-more`

  // If the active value sits past the priority cut, keep the panel open so the
  // selected chip is always visible.
  const activeOptionIndex = options.findIndex((o) => o.value === value)
  const activeBeyondCut =
    prioritySlots > 0 && activeOptionIndex >= prioritySlots && value !== ''
  const [expanded, setExpanded] = useState(activeBeyondCut)
  const isOpen = expanded || activeBeyondCut

  const cutoff = prioritySlots > 0 ? prioritySlots : options.length
  const visible = options.slice(0, cutoff)
  const hidden = options.slice(cutoff)
  const hasMore = hidden.length > 0

  return (
    <fieldset>
      <legend className="mb-1 block font-semibold">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        <FilterChip active={value === ''} onClick={() => onChange('')}>
          Todos
        </FilterChip>
        {visible.map((opt) => (
          <FilterChip
            key={opt.value}
            active={value === opt.value}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </FilterChip>
        ))}
        {hasMore && !isOpen && (
          <button
            type="button"
            aria-expanded={false}
            aria-controls={moreId}
            onClick={() => setExpanded(true)}
            className="inline-flex min-h-touch items-center rounded-sm border border-border-strong bg-surface px-3 text-label text-ink-muted hover:border-primary hover:text-primary"
          >
            {moreLabel} ▾
          </button>
        )}
        {hasMore && isOpen && (
          <>
            <div id={moreId} className="contents">
              {hidden.map((opt) => (
                <FilterChip
                  key={opt.value}
                  active={value === opt.value}
                  onClick={() => onChange(opt.value)}
                >
                  {opt.label}
                </FilterChip>
              ))}
            </div>
            {!activeBeyondCut && (
              <button
                type="button"
                aria-expanded={true}
                aria-controls={moreId}
                onClick={() => setExpanded(false)}
                className="inline-flex min-h-touch items-center rounded-sm border border-border-strong bg-surface px-3 text-label text-ink-muted hover:border-primary hover:text-primary"
              >
                Menos ▴
              </button>
            )}
          </>
        )}
      </div>
    </fieldset>
  )
}
