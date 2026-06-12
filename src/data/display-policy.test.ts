import { describe, expect, it } from 'vitest'
import { dataset } from './units'
import type { HealthUnit } from './types'
import {
  compareUnitsForListing,
  displayCategory,
  isLinkable,
  SEARCH_ALIASES,
} from './display-policy'

const byId = (id: string): HealthUnit => {
  const unit = dataset.units.find((candidate) => candidate.id === id)
  if (!unit) throw new Error(`unit not in dataset: ${id}`)
  return unit
}

describe('display policy (Etapa 2 prompt / report §10)', () => {
  it('lists active care units normally', () => {
    expect(displayCategory(byId('ubs-centro-umrs'))).toBe('care')
    expect(displayCategory(byId('hospital-santa-terezinha-fhste'))).toBe('care')
    expect(displayCategory(byId('farmacia-central'))).toBe('care')
  })

  it('lists the prison unit with its access restriction, not hidden', () => {
    expect(displayCategory(byId('ubs-prisional'))).toBe('care-restricted')
  })

  it('shows planned units only as coming-soon (never active)', () => {
    expect(displayCategory(byId('ubs-novo-atlantico-demoliner'))).toBe('coming-soon')
  })

  it('shows the PA (status verify) under maximum caution', () => {
    expect(displayCategory(byId('pronto-atendimento-umrs'))).toBe('care-cautious')
  })

  it('hides every other status=verify unit (COVID-19 ambulatory)', () => {
    expect(displayCategory(byId('ambulatorio-covid-19'))).toBe('hidden')
  })

  it('hides deactivated units (SAMI)', () => {
    expect(displayCategory(byId('sami-erechim'))).toBe('hidden')
  })

  it('groups management/surveillance bodies as institutional', () => {
    for (const id of [
      'secretaria-municipal-saude',
      'crs-11',
      'vigilancia-sanitaria',
      'nuvepi',
      'cerest-alto-uruguai', // typed specialty-center; institutional by report §3
    ]) {
      expect(displayCategory(byId(id)), id).toBe('institutional')
    }
  })

  it('denies detail pages (links) only to hidden units', () => {
    expect(isLinkable(byId('sami-erechim'))).toBe(false)
    expect(isLinkable(byId('ambulatorio-covid-19'))).toBe(false)
    expect(isLinkable(byId('ubs-centro-umrs'))).toBe(true)
    expect(isLinkable(byId('pronto-atendimento-umrs'))).toBe(true)
    expect(isLinkable(byId('secretaria-municipal-saude'))).toBe(true)
  })

  it('covers every unit in the dataset with some category', () => {
    for (const unit of dataset.units) {
      expect(
        [
          'care',
          'care-restricted',
          'care-cautious',
          'coming-soon',
          'institutional',
          'hidden',
        ],
        unit.id,
      ).toContain(displayCategory(unit))
    }
  })
})

describe('listing order', () => {
  it('sorts by type relevance first, then by name (stable and predictable)', () => {
    const ubs = byId('ubs-atlantico')
    const hospital = byId('hospital-de-caridade')
    const caps = byId('caps-ii')
    expect(compareUnitsForListing(ubs, hospital)).toBeLessThan(0)
    expect(compareUnitsForListing(hospital, caps)).toBeLessThan(0)
    expect(
      compareUnitsForListing(byId('ubs-atlantico'), byId('ubs-bela-vista')),
    ).toBeLessThan(0)
  })
})

describe('search aliases', () => {
  it('only references units that exist in the dataset', () => {
    for (const id of Object.keys(SEARCH_ALIASES)) {
      expect(
        dataset.units.some((unit) => unit.id === id),
        id,
      ).toBe(true)
    }
  })
})
