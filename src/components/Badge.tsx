import type { Confidence } from '../data/types'

/**
 * Data-confidence seal. This is the app's honesty mechanism (briefing §5 /
 * mapping report §10): unverified data is shown with an explicit warning
 * instead of being hidden or softened. Never omit it to "look better".
 *
 * Shape rule (kit §4): the seal is a PILL (radius-pill) — the welcoming
 * counterpart to the rectangular category tag. Two color families (kit §6):
 * success (OK) and warning (caution); amber never reaches AA as a solid, so
 * caution is light-amber bg + dark-brown text.
 */
interface BadgeProps {
  confidence: Confidence
  /**
   * Context-specific wording, e.g. "horário não confirmado — ligue antes".
   * Falls back to the generic PT-BR label for the level.
   */
  label?: string
}

/* UI labels in PT-BR (code in English — project convention). */
const DEFAULT_LABELS: Record<Confidence, string> = {
  'official-recent': 'fonte oficial recente',
  'official-stale': 'fonte oficial — pode estar desatualizado',
  'verified-local': 'confirmado por telefone',
  unverified: 'não confirmado — ligue antes',
}

/* Each confidence level → color family (kit §6). Tokens carry computed AA
   contrast (src/index.css). Meaning is in the TEXT, not color (WCAG 1.4.1). */
type Family = 'success' | 'warning'

const LEVEL_FAMILY: Record<Confidence, Family> = {
  'verified-local': 'success',
  'official-recent': 'success',
  'official-stale': 'warning',
  unverified: 'warning',
}

const FAMILY_CLASS: Record<Family, string> = {
  success: 'bg-conf-ok-bg text-conf-ok',
  warning: 'bg-conf-warn-bg text-conf-warn',
}

/* Leading mark (kit §6): a check for locally verified data, a dot for other
   OK data, an alert icon for caution. Decorative — the label carries meaning. */
function StatusMark({ confidence }: { confidence: Confidence }) {
  if (confidence === 'verified-local') {
    return (
      <svg
        aria-hidden="true"
        viewBox="0 0 16 16"
        className="size-3.5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 8.5 6.5 12 13 4" />
      </svg>
    )
  }
  if (confidence === 'official-recent') {
    return (
      <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-conf-ok-dot" />
    )
  }
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-3.5 shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="8" r="6.25" />
      <path d="M8 5v3.5" />
      <path d="M8 11h.01" />
    </svg>
  )
}

export function Badge({ confidence, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-chip ${FAMILY_CLASS[LEVEL_FAMILY[confidence]]}`}
    >
      <StatusMark confidence={confidence} />
      {label ?? DEFAULT_LABELS[confidence]}
    </span>
  )
}
