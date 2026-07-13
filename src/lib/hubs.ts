import type { HealthUnit } from '../data/types'
import { isLinkable, isMappable } from '../data/display-policy'
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

type UnitKey = (unit: HealthUnit) => string | null

interface KeyedUnitGroup {
  key: string
  units: HealthUnit[]
}

/** Stable grouping primitive shared by address hubs and map-coordinate hubs. */
function groupUnitsByKey(units: HealthUnit[], keyFor: UnitKey): KeyedUnitGroup[] {
  const groups = new Map<string, HealthUnit[]>()

  for (const unit of units) {
    const key = keyFor(unit)
    if (key === null) continue
    const group = groups.get(key)
    if (group) group.push(unit)
    else groups.set(key, [unit])
  }

  return [...groups].map(([key, groupedUnits]) => ({ key, units: groupedUnits }))
}

/** Other units sharing this unit's address (only ones the app may show). */
export function hubMates(unit: HealthUnit, units: HealthUnit[]): HealthUnit[] {
  const key = hubKey(unit)
  if (key === null) return []
  const group = groupUnitsByKey(units.filter(isLinkable), hubKey).find(
    (candidate) => candidate.key === key,
  )
  return group?.units.filter((candidate) => candidate.id !== unit.id) ?? []
}

export interface MappableUnitGroup {
  key: string
  position: [number, number]
  units: HealthUnit[]
}

/**
 * Groups plot-safe units by an exact coordinate pair. Exact means exact:
 * nearby buildings are never merged by rounding or a distance threshold.
 */
export function groupMappableUnitsByCoordinate(units: HealthUnit[]): MappableUnitGroup[] {
  const coordinateKey: UnitKey = (unit) => {
    const { lat, lng } = unit.coordinates
    return lat === null ? null : `${lat}|${lng}`
  }
  const groups = groupUnitsByKey(units.filter(isMappable), coordinateKey)
  const result: MappableUnitGroup[] = []

  for (const group of groups) {
    const first = group.units[0]
    if (!first || first.coordinates.lat === null) continue
    result.push({
      key: group.key,
      position: [first.coordinates.lat, first.coordinates.lng],
      units: group.units,
    })
  }

  return result
}
