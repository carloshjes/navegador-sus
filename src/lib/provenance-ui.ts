import type { Confidence } from '../data/types'

/** "2026-06-11" -> "11/06/2026" (UI is PT-BR; data dates are ISO). */
export function formatDateBR(isoDate: string): string {
  const [year, month, day] = isoDate.split('-')
  return `${day}/${month}/${year}`
}

/**
 * Context-specific Badge labels for opening hours — the most volatile
 * field and the one the report singles out ("horário não confirmado —
 * ligue antes"). Honesty mechanism: never soften, never omit.
 */
export const HOURS_BADGE_LABELS: Record<Confidence, string> = {
  'official-recent': 'horário de fonte oficial',
  'official-stale': 'horário oficial — pode ter mudado',
  'verified-local': 'horário confirmado por telefone',
  unverified: 'horário não confirmado — ligue antes',
}

/**
 * Dialable href for a stored phone value. Strips annotations the data
 * legitimately carries ("(recepcao UMRS)", ", ramal 8926") and keeps
 * short national numbers (192/193/160/136) as-is. Landlines get +55 so
 * the link works for any phone configuration.
 */
export function telHref(phoneValue: string): string {
  const dialablePart = phoneValue.split(',')[0].replace(/\([^)]*\)\s*$/, '')
  const digits = dialablePart.replace(/\D/g, '')
  return digits.length <= 4 ? `tel:${digits}` : `tel:+55${digits}`
}
