import type { ButtonHTMLAttributes } from 'react'
import { Button } from './Button'

/**
 * "Localizar" button (Etapa Visual 4 / A3): the geolocation trigger in the
 * "Ver as unidades mais próximas" block. It is the primary `Button` with a
 * crosshair icon and a primary-strong keyline that sharpens the edge of the
 * solid action. Its width always follows the label: the surrounding band
 * places it below the copy on mobile and at the right edge on desktop.
 */
interface LocateButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
}

export function LocateButton({ children, className = '', ...props }: LocateButtonProps) {
  return (
    <Button
      type="button"
      className={`w-auto self-start border border-primary-strong px-5 font-semibold disabled:cursor-not-allowed disabled:opacity-50 lg:self-auto ${className}`}
      {...props}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-[18px] shrink-0"
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
