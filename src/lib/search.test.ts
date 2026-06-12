import { describe, expect, it } from 'vitest'
import { dataset } from '../data/units'
import { matchesQuery, normalizeText } from './search'

const byId = (id: string) => {
  const unit = dataset.units.find((candidate) => candidate.id === id)
  if (!unit) throw new Error(`unit not in dataset: ${id}`)
  return unit
}

describe('normalizeText', () => {
  it('strips diacritics via NFD decomposition', () => {
    expect(normalizeText('Capoerê')).toBe('capoere')
    expect(normalizeText('São Cristóvão')).toBe('sao cristovao')
    expect(normalizeText('JAGUARETÊ')).toBe('jaguarete')
  })

  it('collapses whitespace and trims', () => {
    expect(normalizeText('  UBS   Centro  ')).toBe('ubs centro')
  })
})

describe('matchesQuery', () => {
  it('finds accented names from unaccented queries (and vice versa)', () => {
    expect(matchesQuery(byId('ubs-capoere'), 'capoerê')).toBe(true)
    expect(matchesQuery(byId('ubs-capoere'), 'CAPOERE')).toBe(true)
    expect(matchesQuery(byId('ubs-sao-cristovao'), 'sao cristovao')).toBe(true)
  })

  it('finds units by alias without touching the canonical JSON', () => {
    // Etapa 0 conflict #5: prefecture says "Estevam", CNES says "ESTEVAO".
    expect(matchesQuery(byId('ubs-estevam-carraro'), 'Estevão Carraro')).toBe(true)
    expect(matchesQuery(byId('sae-ist-hiv'), 'dst')).toBe(true)
  })

  it('finds units by PT-BR service label and type label', () => {
    expect(matchesQuery(byId('farmacia-central'), 'retirada de medicamentos')).toBe(true)
    expect(matchesQuery(byId('ubs-progresso'), 'posto de saude')).toBe(true)
  })

  it('matches nothing for a bogus query', () => {
    const hits = dataset.units.filter((unit) => matchesQuery(unit, 'xyzzy quimera'))
    expect(hits).toHaveLength(0)
  })

  it('matches everything for an empty query', () => {
    expect(matchesQuery(byId('ubs-progresso'), '   ')).toBe(true)
  })
})
