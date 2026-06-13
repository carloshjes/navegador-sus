import type { HealthUnit } from '../data/types'
import { haversineMeters, type LatLng } from './geo'

export interface UnitWithDistance {
  unit: HealthUnit
  /** Straight-line metres from the user; undefined without a position or coordinate. */
  distance?: number
}

/**
 * Pairs each unit with its straight-line distance from `position` and, when
 * a position is given, sorts nearest-first. Units without a coordinate sort
 * to the end. With no position, returns the input order and no distances.
 * Pure (no geolocation, no I/O) so it is unit-testable on its own.
 */
export function withDistances(
  units: HealthUnit[],
  position: LatLng | null,
): UnitWithDistance[] {
  const list: UnitWithDistance[] = units.map((unit) => ({
    unit,
    distance:
      position && unit.coordinates.lat !== null
        ? haversineMeters(position, {
            lat: unit.coordinates.lat,
            lng: unit.coordinates.lng,
          })
        : undefined,
  }))
  if (position) {
    list.sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity))
  }
  return list
}
