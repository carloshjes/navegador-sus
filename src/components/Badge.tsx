import type { Confidence } from '../data/types'

/**
 * Data-confidence seal — Etapa Visual 5 / D. The app's honesty mechanism
 * (briefing §5 / mapping report §10): unverified data shows an explicit
 * warning instead of being hidden or softened. Never omit it to "look better".
 *
 * Shape change (kit §9.2): the seal is now **plain text**, not a pill. The
 * weight bumps to semibold to make up for the lost outline, the color carries
 * the family (success/warning), and an optional icon (alert-triangle / tools)
 * names the sub-type of caution. The pill shape is now reserved for the
 * active-filter chips in the FiltersBar — the form-language was clarified
 * (status = sober text; choices the citizen made = pill).
 *
 * WCAG 1.4.1 (color is not the only sign): meaning lives in the PT-BR label,
 * never in color or icon alone. The icon is `aria-hidden` because the label
 * already says "ainda não atende" / "ligue antes" — assistive tech gets the
 * same message either way.
 */
type IconName = 'alert-triangle' | 'tools'

interface BadgeProps {
  confidence: Confidence
  /**
   * Context-specific wording, e.g. "horário não confirmado — ligue antes".
   * Falls back to the generic PT-BR label for the level.
   */
  label?: string
  /**
   * Optional leading icon. Pair with caution-bearing labels so the visual
   * difference between "verify before going" (alert-triangle) and "doesn't
   * operate yet" (tools) is clear at a glance — see the call-site table in
   * docs/kit-visual-navegador-sus.md §9.2.
   */
  icon?: IconName
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
  success: 'text-conf-ok',
  warning: 'text-conf-warn',
}

/* Inline SVG instead of an icon webfont: keeps the bundle small, lets the
   icon inherit `currentColor` from the text, and avoids the FOUT a webfont
   would cause. Shapes mirror Tabler's `alert-triangle` / `tools`. The
   `data-icon` attribute is a stable anchor for e2e tests. */
function StatusIcon({ name }: { name: IconName }) {
  if (name === 'alert-triangle') {
    return (
      <svg
        aria-hidden="true"
        data-icon="alert-triangle"
        viewBox="0 0 24 24"
        width="13"
        height="13"
        className="shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 9v4" />
        <path d="M12 16h.01" />
        <path d="M5.07 19h13.86c1.54 0 2.5-1.67 1.73-3L13.73 4a2 2 0 0 0-3.46 0L3.34 16c-.77 1.33.19 3 1.73 3" />
      </svg>
    )
  }
  /* tools: a wrench + screwdriver, signalling "under construction". */
  return (
    <svg
      aria-hidden="true"
      data-icon="tools"
      viewBox="0 0 24 24"
      width="13"
      height="13"
      className="shrink-0"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 21h4l13-13a1.5 1.5 0 0 0-4-4L3 17v4" />
      <path d="m14.5 5.5 4 4" />
      <path d="m12 8 7 7" />
      <path d="m5 19 4-4" />
    </svg>
  )
}

export function Badge({ confidence, label, icon }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-[5px] text-meta font-semibold ${FAMILY_CLASS[LEVEL_FAMILY[confidence]]}`}
    >
      {icon && <StatusIcon name={icon} />}
      {label ?? DEFAULT_LABELS[confidence]}
    </span>
  )
}
