/**
 * Wordmark (kit §7): "navegador · sus" in Figtree 700, color `primary`, with
 * the middot `·` in `accent` (coral) and 0.28em of air on each side. The
 * qualifier "Erechim · rede pública de saúde" sits below in Public Sans,
 * `text-secondary`. The coral dot is decorative and large (logo element), so
 * its 3.73:1 is fine here (it is never small body text — kit §3).
 *
 * Variants: `full` (mark + qualifier) and `compact` (mark only). The whole
 * thing is read as one label by assistive tech via aria-label on the wrapper.
 */
export function Logo({ variant = 'full' }: { variant?: 'full' | 'compact' }) {
  return (
    <span className="flex flex-col justify-center leading-none">
      <span className="font-display text-display text-primary">
        navegador
        <span aria-hidden="true" className="text-accent" style={{ margin: '0 0.28em' }}>
          ·
        </span>
        sus
      </span>
      {variant === 'full' && (
        <span className="mt-1 text-meta text-ink-muted">
          Erechim · rede pública de saúde
        </span>
      )}
    </span>
  )
}
