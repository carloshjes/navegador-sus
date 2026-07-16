/**
 * Wordmark (kit §7) + icon (kit §8). "navegador · sus" is white in
 * Figtree 600, with 0.28em of air around the middot. The header variant uses
 * a white outline pin and a filled white cross; app icons keep the solid
 * primary pin. The containing link owns the accessible name, so this visual
 * mark stays hidden from assistive technology and is announced only once.
 *
 * Variants:
 *  - `full` (default): icon + wordmark — used in the header.
 *  - `wordmark`: wordmark only — kept for places where the icon would crowd.
 */
type LogoVariant = 'full' | 'wordmark'

export function Logo({ variant = 'full' }: { variant?: LogoVariant }) {
  return (
    <span aria-hidden="true" className="inline-flex items-center gap-2.5 leading-none">
      {variant === 'full' && (
        <svg
          aria-hidden="true"
          width="38"
          height="38"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="size-[34px] shrink-0 sm:size-[38px]"
        >
          <path
            d="M12 1.6c-4.3 0-7.8 3.4-7.8 7.5 0 5.3 7.8 13.3 7.8 13.3s7.8-8 7.8-13.3c0-4.1-3.5-7.5-7.8-7.5z"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          />
          <rect
            x="10.85"
            y="5.4"
            width="2.3"
            height="7.4"
            rx="0.5"
            fill="currentColor"
            className="text-white"
          />
          <rect
            x="8.4"
            y="7.95"
            width="7.2"
            height="2.3"
            rx="0.5"
            fill="currentColor"
            className="text-white"
          />
        </svg>
      )}
      <span className="font-display text-display font-semibold text-white">
        navegador
        <span aria-hidden="true" style={{ margin: '0 0.28em' }}>
          ·
        </span>
        sus
      </span>
    </span>
  )
}
