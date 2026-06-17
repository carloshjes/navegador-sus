import type { ButtonHTMLAttributes } from 'react'
import { Button } from './Button'

/**
 * "Localizar" button (Etapa Visual 4 / A3): the geolocation trigger in the
 * "Ver as unidades mais próximas" block. It is the primary `Button` with a
 * crosshair icon — sharing the component's radius (kit radius-md) and label
 * size so every primary CTA in the app matches (audit P2). Hover is only the
 * `bg` darken Button already does — no scale, no shadow. On mobile the block
 * stacks and the button takes the full width (`w-full sm:w-auto`).
 */
interface LocateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  fullWidthMobile?: boolean
}

export function LocateButton({
  children,
  fullWidthMobile = false,
  className = '',
  ...props
}: LocateButtonProps) {
  const width = fullWidthMobile ? 'w-full sm:w-auto' : ''
  return (
    <Button
      type="button"
      className={`disabled:cursor-not-allowed disabled:opacity-50 ${width} ${className}`}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-[15px] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* ti-crosshair: circle + four cardinal ticks. */}
        <circle cx="12" cy="12" r="7" />
        <path d="M12 2v3" />
        <path d="M12 19v3" />
        <path d="M2 12h3" />
        <path d="M19 12h3" />
      </svg>
      {children}
    </Button>
  )
}
