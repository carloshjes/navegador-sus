import { useId, useRef, useState } from 'react'
import { FilterOption } from './FilterOption'

interface Option<V extends string> {
  value: V
  label: string
}

interface FilterChipGroupProps<V extends string> {
  legend: string
  options: readonly Option<V>[]
  value: V | ''
  onChange: (value: V | '') => void
  /** Items kept visible before the inline "Ver mais" disclosure. */
  prioritySlots?: number
  /** Noun used by the disclosure, e.g. "tipos", "serviços", "bairros". */
  moreLabel?: string
}

function ChevronDown({ expanded }: { expanded: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`size-4 shrink-0 ${expanded ? 'rotate-180' : ''}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.25"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

/**
 * Accessible single-choice filter group. The same DOM works at every
 * breakpoint: mobile/tablet can disclose the group in normal flow, while the
 * desktop sidebar keeps the option list visible through CSS. Long lists use
 * a second inline disclosure; no dialog, focus trap or matchMedia branch.
 */
export function FilterChipGroup<V extends string>({
  legend,
  options,
  value,
  onChange,
  prioritySlots = 0,
  moreLabel = 'opções',
}: FilterChipGroupProps<V>) {
  const reactId = useId()
  const groupName = `${reactId}-choice`
  const panelId = `${reactId}-panel`
  const listId = `${reactId}-list`
  const [groupOpen, setGroupOpen] = useState(value !== '')
  const [moreOpen, setMoreOpen] = useState(false)
  const groupToggleRef = useRef<HTMLButtonElement | null>(null)
  const moreToggleRef = useRef<HTMLButtonElement | null>(null)

  const cutoff = prioritySlots > 0 ? prioritySlots : options.length
  const hasMore = options.length > cutoff
  const selectedOption = options.find((option) => option.value === value)
  const collapsedOptions = options.filter(
    (option, index) => index < cutoff || option.value === value,
  )
  const renderedOptions = moreOpen ? options : collapsedOptions
  const selectedLabel = selectedOption?.label ?? 'Todos'

  return (
    <fieldset className="border-t border-edge py-2 lg:py-3">
      <legend className="sr-only">{legend}</legend>

      <button
        type="button"
        ref={groupToggleRef}
        aria-expanded={groupOpen}
        aria-controls={panelId}
        onClick={() => {
          setGroupOpen((open) => !open)
          groupToggleRef.current?.focus()
        }}
        className="flex min-h-touch w-full items-center justify-between gap-3 py-1 text-start lg:hidden"
      >
        <span>
          <span className="block font-semibold text-ink">{legend}</span>
          <span className="block text-meta text-ink-muted">
            Selecionado: {selectedLabel}
          </span>
        </span>
        <ChevronDown expanded={groupOpen} />
      </button>

      <p aria-hidden="true" className="hidden font-semibold text-ink lg:block">
        {legend}
      </p>

      <div id={panelId} className={`${groupOpen ? 'block' : 'hidden'} lg:block`}>
        <div id={listId} className="mt-1 divide-y divide-edge">
          <FilterOption
            name={groupName}
            value=""
            active={value === ''}
            label="Todos"
            onSelect={() => onChange('')}
          />
          {renderedOptions.map((option) => (
            <FilterOption
              key={option.value}
              name={groupName}
              value={option.value}
              active={value === option.value}
              label={option.label}
              onSelect={() => onChange(option.value)}
            />
          ))}
        </div>

        {hasMore && (
          <button
            type="button"
            ref={moreToggleRef}
            aria-expanded={moreOpen}
            aria-controls={listId}
            onClick={() => {
              setMoreOpen((open) => !open)
              moreToggleRef.current?.focus()
            }}
            className="flex min-h-touch w-full items-center justify-between gap-2 border-t border-edge px-1 py-2 text-meta font-semibold text-primary hover:underline"
          >
            <span>{moreOpen ? `Ver menos ${moreLabel}` : `Ver mais ${moreLabel}`}</span>
            <ChevronDown expanded={moreOpen} />
          </button>
        )}
      </div>
    </fieldset>
  )
}
