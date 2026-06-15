import type { ButtonHTMLAttributes } from 'react'

/**
 * "Localizar" button (Etapa Visual 4 / A3): the geolocation trigger in the
 * "Ver as unidades mais próximas" block. Solid primary, **radius 4px** (the
 * kit's signage rectangle — chips and tags are 4px; this is consistent), with
 * a crosshair icon. Hover is only a `bg-color` darken to `primary-strong` —
 * no scale, no shadow. On mobile the block stacks and the button takes the
 * full width (`w-full sm:w-auto`).
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
    <button
      type="button"
      className={`inline-flex min-h-touch items-center justify-center gap-2 rounded-[4px] bg-primary px-4 py-[10px] text-[13px] font-semibold tracking-[0.02em] text-white no-underline transition-colors duration-[180ms] ease-out hover:bg-primary-strong disabled:cursor-not-allowed disabled:opacity-50 ${width} ${className}`}
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
    </button>
  )
}
