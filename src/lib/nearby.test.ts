import { describe, expect, it } from 'vitest'
import type { HealthUnit } from '../data/types'
import { withDistances } from './nearby'

/** Minimal unit stub with just the fields withDistances reads. */
const unitAt = (id: string, lat: number | null, lng: number | null): HealthUnit =>
  ({
    id,
    coordinates:
      lat === null
        ? { lat: null, lng: null, source: null, flag: 'geocode-manually' }
        : { lat, lng: lng as number, source: 'cnes', checkedAt: '2026-06-13' },
  }) as HealthUnit

const near = { lat: -27.646, lng: -52.298 } // close to "south"

describe('withDistances', () => {
  it('returns the input order and no distances without a position', () => {
    const units = [unitAt('a', -27.6, -52.2), unitAt('b', -27.7, -52.3)]
    const result = withDistances(units, null)
    expect(result.map((r) => r.unit.id)).toEqual(['a', 'b'])
    expect(result.every((r) => r.distance === undefined)).toBe(true)
  })

  it('sorts nearest-first when given a position', () => {
    const south = unitAt('south', -27.646, -52.298) // basically at `near`
    const north = unitAt('north', -27.52, -52.25) // far
    const result = withDistances([north, south], near)
    expect(result.map((r) => r.unit.id)).toEqual(['south', 'north'])
    expect(result[0].distance).toBeLessThan(result[1].distance as number)
  })

  it('sends units without a coordinate to the end', () => {
    const withCoord = unitAt('has', -27.64, -52.29)
    const without = unitAt('none', null, null)
    const result = withDistances([without, withCoord], near)
    expect(result[result.length - 1].unit.id).toBe('none')
    expect(result[result.length - 1].distance).toBeUndefined()
  })
})
