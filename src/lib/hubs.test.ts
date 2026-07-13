import { describe, expect, it } from 'vitest'
import { dataset } from '../data/units'
import { groupMappableUnitsByCoordinate, hubKey, hubMates } from './hubs'

const byId = (id: string) => {
  const unit = dataset.units.find((candidate) => candidate.id === id)
  if (!unit) throw new Error(`unit not in dataset: ${id}`)
  return unit
}

describe('hubKey (address normalization)', () => {
  it('ignores parenthetical notes, accents and case', () => {
    // "Rua Alemanha, 985 (Acesso 01)" and "Rua Alemanha, 985" are the
    // same place — the UMRS hub found in Etapa 0.
    expect(hubKey(byId('ubs-centro-umrs'))).toBe(hubKey(byId('pronto-atendimento-umrs')))
    // "Avenida Santo Dal Bosco, 160 (terreo)" === ", 160"
    expect(hubKey(byId('farmacia-central'))).toBe(hubKey(byId('sae-ist-hiv')))
  })

  it('keeps different street numbers apart (160 vs 200)', () => {
    expect(hubKey(byId('sae-ist-hiv'))).not.toBe(hubKey(byId('cre-municipal')))
  })

  it('returns null when there is no street to compare', () => {
    expect(hubKey(byId('ubs-prisional'))).toBeNull()
  })
})

describe('hubMates', () => {
  it('finds the UMRS hub (Rua Alemanha, 985): five services, one address', () => {
    const mates = hubMates(byId('ubs-centro-umrs'), dataset.units)
    const ids = mates.map((unit) => unit.id).sort()
    expect(ids).toEqual([
      'ambulatorio-feridas-cronicas',
      'ambulatorio-saude-mental',
      'centro-referencia-mulher',
      'pronto-atendimento-umrs',
    ])
  })

  it('finds the Santo Dal Bosco 200 pair (CRE + Secretaria)', () => {
    const ids = hubMates(byId('cre-municipal'), dataset.units).map((unit) => unit.id)
    expect(ids).toEqual(['secretaria-municipal-saude'])
  })

  it('never lists hidden units as hub mates', () => {
    for (const unit of dataset.units) {
      const ids = hubMates(unit, dataset.units).map((mate) => mate.id)
      expect(ids).not.toContain('sami-erechim')
      expect(ids).not.toContain('ambulatorio-covid-19')
    }
  })

  it('units without street have no hub mates', () => {
    expect(hubMates(byId('ubs-prisional'), dataset.units)).toEqual([])
  })
})

describe('groupMappableUnitsByCoordinate', () => {
  it('turns the five plot-safe UMRS services into one coordinate group', () => {
    const groups = groupMappableUnitsByCoordinate(dataset.units)
    const umrs = groups.find((group) =>
      group.units.some((unit) => unit.id === 'ubs-centro-umrs'),
    )

    expect(umrs?.position).toEqual([-27.635, -52.285])
    expect(umrs?.units.map((unit) => unit.id).sort()).toEqual([
      'ambulatorio-feridas-cronicas',
      'ambulatorio-saude-mental',
      'centro-referencia-mulher',
      'pronto-atendimento-umrs',
      'ubs-centro-umrs',
    ])
  })

  it('keeps a unit with unique coordinates in a one-item group', () => {
    const groups = groupMappableUnitsByCoordinate(dataset.units)
    const hospital = groups.find((group) =>
      group.units.some((unit) => unit.id === 'hospital-de-caridade'),
    )

    expect(hospital?.units.map((unit) => unit.id)).toEqual(['hospital-de-caridade'])
  })
})
