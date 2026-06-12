import type { Confidence } from '../data/types'

/**
 * Data-confidence seal. This is the app's honesty mechanism (briefing §5 /
 * mapping report §10): unverified data is shown with an explicit warning
 * instead of being hidden or softened. Never omit it to "look better".
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

/* Color pairs are tokens with computed AA contrast (src/index.css).
   Meaning is carried by the TEXT, not by color alone (WCAG 1.4.1). */
const LEVEL_CLASSES: Record<Confidence, string> = {
  'official-recent': 'bg-conf-recent-bg text-conf-recent',
  'official-stale': 'bg-conf-stale-bg text-conf-stale',
  'verified-local': 'bg-conf-local-bg text-conf-local',
  unverified: 'bg-conf-unverified-bg text-conf-unverified',
}

export function Badge({ confidence, label }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${LEVEL_CLASSES[confidence]}`}
    >
      {label ?? DEFAULT_LABELS[confidence]}
    </span>
  )
}
