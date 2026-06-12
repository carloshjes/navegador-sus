import { describe, expect, it } from 'vitest'
import { activeUnits, dataset } from './units'

/*
 * Data-integrity tests — the guardians of the product's #1 value
 * (information accuracy). The dataset will be edited many times (phone
 * verification round, new sources, coordinate updates); every edit must
 * get past these checks.
 */

/**
 * Accepted phone formats in the dataset:
 *  - national short numbers: "192", "193", "160", "136"
 *  - landline: "(54) 3520-7220", optionally with ", ramal NNN" and/or a
 *    trailing "(annotation)" — e.g. "(54) 3520-7221 (recepcao UMRS)"
 */
const PHONE_PATTERN =
  /^(?:\d{3}|\(\d{2}\) \d{4,5}-\d{4}(?:, ramal \d+)?(?: \([^()]+\))?)$/

// Erechim bounding box (same guard as scripts/fetch-coordinates.mjs).
const BBOX = { latMax: -27.45, latMin: -27.95, lngMax: -52.05, lngMin: -52.55 }

describe('unit identity', () => {
  it('has unique unit ids', () => {
    const ids = dataset.units.map((unit) => unit.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique transversal channel ids', () => {
    const ids = dataset.transversalChannels.map((channel) => channel.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('has unique CNES codes among units that have one', () => {
    const codes = dataset.units
      .map((unit) => unit.cnesCode)
      .filter((code): code is string => code !== null)
    expect(new Set(codes).size).toBe(codes.length)
  })
})

describe('required fields', () => {
  it('every unit has non-empty id, name, type, status and managedBy', () => {
    for (const unit of dataset.units) {
      expect(unit.id, unit.id).not.toBe('')
      expect(unit.name, unit.id).not.toBe('')
      expect(unit.type, unit.id).toBeTruthy()
      expect(unit.status, unit.id).toBeTruthy()
      expect(unit.managedBy, unit.id).not.toBe('')
    }
  })

  it('every unit is located in Erechim/RS', () => {
    for (const unit of dataset.units) {
      expect(unit.address.city, unit.id).toBe('Erechim')
      expect(unit.address.state, unit.id).toBe('RS')
    }
  })
})

describe('phone numbers', () => {
  it('every non-null unit phone has a dialable format', () => {
    for (const unit of dataset.units) {
      if (unit.phone.value !== null) {
        expect(unit.phone.value, `${unit.id}: "${unit.phone.value}"`).toMatch(
          PHONE_PATTERN,
        )
      }
    }
  })

  it('every non-null transversal channel phone has a dialable format', () => {
    for (const channel of dataset.transversalChannels) {
      if (channel.phone.value !== null) {
        expect(channel.phone.value, `${channel.id}: "${channel.phone.value}"`).toMatch(
          PHONE_PATTERN,
        )
      }
    }
  })
})

describe('coordinates', () => {
  it('every resolved, non-suspect coordinate falls inside the Erechim box', () => {
    for (const unit of dataset.units) {
      const { coordinates } = unit
      if (coordinates.lat !== null && coordinates.flag !== 'suspect') {
        expect(coordinates.lat, unit.id).toBeGreaterThanOrEqual(BBOX.latMin)
        expect(coordinates.lat, unit.id).toBeLessThanOrEqual(BBOX.latMax)
        expect(coordinates.lng, unit.id).toBeGreaterThanOrEqual(BBOX.lngMin)
        expect(coordinates.lng, unit.id).toBeLessThanOrEqual(BBOX.lngMax)
      }
    }
  })

  it('resolved coordinates always carry source and check date', () => {
    for (const unit of dataset.units) {
      const { coordinates } = unit
      if (coordinates.lat !== null) {
        expect(coordinates.source, unit.id).toBeTruthy()
        expect(coordinates.checkedAt, unit.id).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      }
    }
  })
})

describe('active units', () => {
  it('never counts deactivated, planned or verify units as active', () => {
    for (const unit of activeUnits) {
      expect(unit.status, unit.id).toBe('active')
    }
  })

  it('matches the dataset count of status=active units', () => {
    const expected = dataset.units.filter((unit) => unit.status === 'active').length
    expect(activeUnits.length).toBe(expected)
  })
})
