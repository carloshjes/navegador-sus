/**
 * Wordmark (kit §7) + icon (kit §8). "navegador · sus" in Figtree 700, white
 * with the coral dot `·` (`accent`) and 0.28em of air on each side. The icon
 * is the same pin used as the app favicon; on the tonal header its pin is
 * coral so the fixed white cross remains visible (Visual Stage 10). The whole
 * mark is read as one label via aria-label on the wrapper — the inner
 * SVG/text stays aria-hidden.
 *
 * Variants:
 *  - `full` (default): icon + wordmark — used in the header.
 *  - `wordmark`: wordmark only — kept for places where the icon would crowd.
 */
type LogoVariant = 'full' | 'wordmark'

export function Logo({ variant = 'full' }: { variant?: LogoVariant }) {
  return (
    <span className="inline-flex items-center gap-2 leading-none">
      {variant === 'full' && (
        <svg
          aria-hidden="true"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0"
        >
          <path
            d="M12 1.6c-4.3 0-7.8 3.4-7.8 7.5 0 5.3 7.8 13.3 7.8 13.3s7.8-8 7.8-13.3c0-4.1-3.5-7.5-7.8-7.5z"
            fill="currentColor"
            className="text-accent"
          />
          <rect x="10.85" y="5.4" width="2.3" height="7.4" rx="0.5" fill="#fff" />
          <rect x="8.4" y="7.95" width="7.2" height="2.3" rx="0.5" fill="#fff" />
        </svg>
      )}
      <span className="font-display text-title text-white">
        navegador
        <span aria-hidden="true" className="text-accent" style={{ margin: '0 0.28em' }}>
          ·
        </span>
        sus
      </span>
    </span>
  )
}
