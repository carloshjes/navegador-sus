import { describe, expect, it } from 'vitest'
import { dataset } from './units'
import { displayCategory, isMappable } from './display-policy'

const byId = (id: string) => {
  const unit = dataset.units.find((candidate) => candidate.id === id)
  if (!unit) throw new Error(`unit not in dataset: ${id}`)
  return unit
}

describe('map plotting policy (Etapa 3, Tarefa 1)', () => {
  it('every mappable unit has a CHECKED coordinate (the core invariant)', () => {
    // "Map only takes a checked coordinate": corroborated (crossCheck) or
    // a human-decided/derived point (not a bare CNES guess).
    for (const unit of dataset.units.filter(isMappable)) {
      const c = unit.coordinates
      expect(c.lat, unit.id).not.toBeNull()
      const checked = c.crossCheck != null || c.source !== 'cnes'
      expect(checked, `${unit.id} plotted without a check`).toBe(true)
    }
  })

  it('never plots a unit with an unresolved suspect flag', () => {
    for (const unit of dataset.units.filter(isMappable)) {
      expect(unit.coordinates.flag, unit.id).not.toBe('suspect')
    }
  })

  it('never plots management/surveillance bodies or hidden units', () => {
    for (const unit of dataset.units.filter(isMappable)) {
      expect(['institutional', 'hidden'], unit.id).not.toContain(displayCategory(unit))
    }
  })

  it('keeps SAMU (a phone channel), the prison unit and the address-less rehab off the map', () => {
    expect(isMappable(byId('samu-erechim'))).toBe(false)
    expect(isMappable(byId('ubs-prisional'))).toBe(false)
    expect(isMappable(byId('unidade-municipal-reabilitacao'))).toBe(false)
  })

  it('plots the corrected UBS Centro and the OSM-located hospital', () => {
    expect(isMappable(byId('ubs-centro-umrs'))).toBe(true)
    expect(isMappable(byId('hospital-de-caridade'))).toBe(true)
  })

  it('plots the planned Novo Atlântico (coming-soon) once geocoded', () => {
    expect(isMappable(byId('ubs-novo-atlantico-demoliner'))).toBe(true)
  })

  it('the UMRS hub units share the UBS Centro point (shared-address)', () => {
    const centro = byId('ubs-centro-umrs').coordinates
    for (const id of [
      'pronto-atendimento-umrs',
      'ambulatorio-saude-mental',
      'centro-referencia-mulher',
      'ambulatorio-feridas-cronicas',
    ]) {
      const c = byId(id).coordinates
      expect(c.source, id).toBe('shared-address')
      expect(c.lat, id).toBe(centro.lat)
      expect(c.lng, id).toBe(centro.lng)
    }
  })
})
