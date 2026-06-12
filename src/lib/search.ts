import type { HealthUnit } from '../data/types'
import { SERVICE_LABELS, UNIT_TYPE_LABELS } from '../data/labels'
import { SEARCH_ALIASES } from '../data/display-policy'

/**
 * Accent- and case-insensitive matching. NFD decomposes "ê" into
 * "e" + combining circumflex (U+0302); stripping the combining-mark
 * range U+0300–U+036F leaves the bare letter, so "Capoerê" and
 * "capoere" meet on neutral ground.
 */
export function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Everything a unit can be found by: name, neighborhood, translated
 * type, PT-BR service labels and explicit aliases (display-policy).
 */
export function buildSearchCorpus(unit: HealthUnit): string {
  const parts = [
    unit.name,
    unit.address.neighborhood ?? '',
    UNIT_TYPE_LABELS[unit.type],
    ...unit.services.map((slug) => SERVICE_LABELS[slug]),
    ...(SEARCH_ALIASES[unit.id] ?? []),
  ]
  return normalizeText(parts.join(' '))
}

export function matchesQuery(unit: HealthUnit, query: string): boolean {
  const normalizedQuery = normalizeText(query)
  if (normalizedQuery === '') return true
  return buildSearchCorpus(unit).includes(normalizedQuery)
}
