import { useEffect, useId, useRef, useState } from 'react'
import { Button } from './Button'
import { FilterChip } from './FilterChip'

/**
 * Family of chips with a "Mais ▾" disclosure for long lists.
 *
 * Etapa Visual 4 / B3+B4: the "Mais" affordance changed identity:
 * - **B3**: it's a teal-text button with a rotating chevron — no longer
 *   styled like a chip, so it doesn't blend with inactive chips.
 * - **B4**: on small screens (< 640px) clicking "Mais" opens a native
 *   `<dialog>` bottom-sheet (focus trap, Esc to close, backdrop click,
 *   return-focus all free); on `≥ 640px` it expands inline (as before).
 *
 * The disclosure announces itself via `aria-expanded` + `aria-controls`.
 * If the active value sits past the priority cut, the inline panel opens
 * automatically so the selected chip is always visible to mouse users.
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

/** ⌵ chevron used by the disclosure button and the bottom-sheet close. */
function ChevronDown({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`size-[14px] shrink-0 ${className}`}
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

/** Tailwind `sm` breakpoint: matchMedia stays in sync if the user rotates. */
function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(max-width: 639px)').matches
  })
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)')
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return isMobile
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
  const sheetTitleId = `${reactId}-sheet-title`
  const isMobile = useIsMobile()
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)

  // If the active value sits past the priority cut, the inline panel opens
  // so the selected chip is always visible. Mobile uses the sheet instead
  // — no "auto-open" there, the user opens it deliberately.
  const activeOptionIndex = options.findIndex((o) => o.value === value)
  const activeBeyondCut =
    prioritySlots > 0 && activeOptionIndex >= prioritySlots && value !== ''
  const [inlineOpen, setInlineOpen] = useState(activeBeyondCut)
  const [sheetOpen, setSheetOpen] = useState(false)
  const isOpen = isMobile ? sheetOpen : inlineOpen || activeBeyondCut

  const cutoff = prioritySlots > 0 ? prioritySlots : options.length
  const visible = options.slice(0, cutoff)
  const hidden = options.slice(cutoff)
  const hasMore = hidden.length > 0

  const openMore = () => {
    if (isMobile) {
      setSheetOpen(true)
      dialogRef.current?.showModal()
    } else {
      setInlineOpen(true)
    }
  }

  const closeMore = () => {
    if (isMobile) {
      setSheetOpen(false)
      dialogRef.current?.close()
      // Return focus to the trigger (`<dialog>` doesn't do it for us
      // when we close programmatically).
      triggerRef.current?.focus()
    } else {
      setInlineOpen(false)
    }
  }

  // `<dialog>` fires "close" on Esc and backdrop click — keep state in sync.
  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    const onClose = () => setSheetOpen(false)
    dialog.addEventListener('close', onClose)
    return () => dialog.removeEventListener('close', onClose)
  }, [])

  return (
    <fieldset>
      <legend className="mb-1 block font-semibold">{legend}</legend>
      <div className="flex flex-wrap items-center gap-2">
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

        {/* Desktop: chips revealed inline BEFORE the toggle, so when expanded
            the "Menos" button sits at the END of the set (not stranded mid-row).
            Mobile: the sheet below holds them instead — keeping the page short. */}
        {hasMore && !isMobile && isOpen && (
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
        )}

        {hasMore && (
          <button
            type="button"
            ref={triggerRef}
            aria-expanded={isOpen}
            aria-controls={moreId}
            onClick={isOpen ? closeMore : openMore}
            className="transition-chip inline-flex min-h-touch items-center gap-1 rounded-sm px-2 py-2 text-meta font-semibold text-primary no-underline hover:bg-surface-hover"
          >
            {isOpen && !isMobile ? 'Menos' : moreLabel}
            <ChevronDown
              className={`transition-transform duration-200 ${isOpen && !isMobile ? 'rotate-180' : ''}`}
            />
          </button>
        )}
      </div>

      {/* Bottom sheet (mobile only). Native <dialog> gives us focus trap,
          Esc-to-close and a backdrop ::backdrop pseudo-element for free. */}
      {hasMore && (
        <dialog
          id={moreId}
          ref={dialogRef}
          aria-labelledby={sheetTitleId}
          className="bottom-sheet"
        >
          <div className="flex h-full max-h-[80dvh] flex-col">
            <div className="flex items-center justify-between border-b border-edge px-4 py-3">
              <h2
                id={sheetTitleId}
                className="font-display text-title font-semibold text-ink"
              >
                {moreLabel}
              </h2>
              <button
                type="button"
                onClick={closeMore}
                aria-label="Fechar"
                className="inline-flex size-touch items-center justify-center rounded-md text-ink-muted hover:bg-bg"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 overflow-y-auto px-4 py-4">
              <FilterChip
                active={value === ''}
                onClick={() => {
                  onChange('')
                }}
                className="justify-center"
              >
                Todos
              </FilterChip>
              {options.map((opt) => (
                <FilterChip
                  key={opt.value}
                  active={value === opt.value}
                  onClick={() => onChange(opt.value)}
                  className="justify-center"
                >
                  {opt.label}
                </FilterChip>
              ))}
            </div>
            <div className="border-t border-edge px-4 py-3">
              <Button type="button" onClick={closeMore} className="w-full">
                Aplicar
              </Button>
            </div>
          </div>
        </dialog>
      )}
    </fieldset>
  )
}
