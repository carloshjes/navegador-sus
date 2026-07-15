import type { InputHTMLAttributes } from 'react'

interface FilterOptionProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  active: boolean
  label: string
  onSelect: () => void
}

/**
 * Native single-choice filter rendered as a consultation-list row. The
 * complete label is the 44px touch target. The native radio is the persistent
 * state indicator and semibold text reinforces selection without adding a
 * filled row, duplicate check or color-only cue.
 */
export function FilterOption({
  active,
  label,
  onSelect,
  className = '',
  ...props
}: FilterOptionProps) {
  return (
    <label
      data-selected={active ? 'true' : 'false'}
      className={`flex min-h-touch cursor-pointer items-center gap-3 bg-transparent px-1 py-2 text-label text-ink ${
        active ? 'font-semibold' : ''
      } ${className}`}
    >
      <input
        {...props}
        type="radio"
        checked={active}
        onChange={onSelect}
        className="scroll-mb-bar size-5 shrink-0 accent-primary"
      />
      <span className="min-w-0 grow">{label}</span>
    </label>
  )
}
