import type { HealthUnit } from '../data/types'
import { isLinkable } from '../data/display-policy'
import { normalizeText } from './search'

/**
 * "Hub" detection — Etapa 0 found that one address can house several
 * different services (UMRS at Rua Alemanha 985 houses five; Av. Santo
 * Dal Bosco 160 and 200 house five more). Same address ≠ same service
 * is a real source of user confusion, so detail pages cross-link units
 * sharing an address.
 */

/**
 * Canonical key for an address: parenthetical notes dropped ("(Acesso
 * 01)", "(terreo)"), accents/case/punctuation normalized. Returns null
 * when there is no street to compare.
 */
export function hubKey(unit: HealthUnit): string | null {
  const street = unit.address.street
  if (!street) return null
  const withoutNotes = street.replace(/\([^)]*\)/g, ' ')
  return normalizeText(withoutNotes.replace(/[.,;]/g, ' '))
}

/** Other units sharing this unit's address (only ones the app may show). */
export function hubMates(unit: HealthUnit, units: HealthUnit[]): HealthUnit[] {
  const key = hubKey(unit)
  if (key === null) return []
  return units.filter(
    (candidate) =>
      candidate.id !== unit.id && isLinkable(candidate) && hubKey(candidate) === key,
  )
}
