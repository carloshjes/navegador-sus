import { describe, expect, it } from 'vitest'
import { formatStraightLineDistance, haversineMeters } from './geo'

describe('haversineMeters', () => {
  it('is zero for the same point', () => {
    expect(haversineMeters({ lat: -27.6, lng: -52.3 }, { lat: -27.6, lng: -52.3 })).toBe(
      0,
    )
  })

  it('matches the known ~111.19 km per degree of latitude', () => {
    const d = haversineMeters({ lat: 0, lng: 0 }, { lat: 1, lng: 0 })
    expect(d).toBeGreaterThan(111_000)
    expect(d).toBeLessThan(111_400)
  })

  it('is symmetric', () => {
    const a = { lat: -27.635, lng: -52.285 }
    const b = { lat: -27.646, lng: -52.298 }
    expect(haversineMeters(a, b)).toBeCloseTo(haversineMeters(b, a), 6)
  })

  it('measures a known Erechim pair within a sane range (~1.8 km)', () => {
    // UBS Centro ↔ UBS Presidente Vargas
    const d = haversineMeters(
      { lat: -27.635, lng: -52.285 },
      { lat: -27.646, lng: -52.298 },
    )
    expect(d).toBeGreaterThan(1500)
    expect(d).toBeLessThan(2200)
  })
})

describe('formatStraightLineDistance', () => {
  it('rounds sub-kilometre distances to 10 m, in PT-BR', () => {
    expect(formatStraightLineDistance(44)).toBe('~40 m')
    expect(formatStraightLineDistance(856)).toBe('~860 m')
  })

  it('shows kilometres with a comma decimal', () => {
    expect(formatStraightLineDistance(1500)).toBe('~1,5 km')
    expect(formatStraightLineDistance(1234)).toBe('~1,2 km')
    expect(formatStraightLineDistance(12000)).toBe('~12,0 km')
  })
})
