import type { ButtonHTMLAttributes } from 'react'

/**
 * Filter chip (kit §5): a rectangular (radius-sm) toggle. Active = primary
 * solid + white; inactive = surface + border-strong + secondary text. It is a
 * real <button> with `aria-pressed` (not color alone — WCAG 1.4.1/4.1.2) and
 * meets the 44px touch floor. Shape follows the rule "category = rectangle".
 */
interface FilterChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  active: boolean
}

export function FilterChip({ active, className = '', ...props }: FilterChipProps) {
  const tone = active
    ? 'bg-primary text-white'
    : 'border border-border-strong bg-surface text-ink-muted hover:border-primary hover:text-primary'
  return (
    <button
      type="button"
      aria-pressed={active}
      className={`inline-flex min-h-touch items-center rounded-sm px-3 text-label ${tone} ${className}`}
      {...props}
    />
  )
}
