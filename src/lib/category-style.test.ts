import { describe, expect, it } from 'vitest'
import { dataset } from '../data/units'
import { UNIT_TYPES } from '../data/types'
import {
  categoryFamily,
  categoryFamilyForType,
  displayCategory,
} from '../data/display-policy'
import { CATEGORY_STYLE } from './category-style'

/*
 * Visual kit §4: category eyebrow color and wording are config, not scattered
 * ifs. Every category a citizen can see must resolve to one mapped text color
 * and an explicit PT-BR label.
 */
describe('category colors (kit §3/§4)', () => {
  it('maps every unit type to a family that has a color style', () => {
    for (const type of UNIT_TYPES) {
      const style = CATEGORY_STYLE[categoryFamilyForType(type)]
      expect(style, type).toBeDefined()
      // Category colors are AA as text on the white card surface (kit §3).
      expect(style.textClassName, type).toMatch(/^text-cat-/)
    }
  })

  it('gives every displayable unit a category style', () => {
    for (const unit of dataset.units) {
      if (displayCategory(unit) === 'hidden') continue
      const style = CATEGORY_STYLE[categoryFamily(unit)]
      expect(style, unit.id).toBeDefined()
      expect(style.label.length, unit.id).toBeGreaterThan(0)
    }
  })

  it('keeps the institutional override (CEREST reads as admin)', () => {
    const cerest = dataset.units.find((u) => u.id === 'cerest-alto-uruguai')
    expect(cerest).toBeDefined()
    expect(categoryFamily(cerest!)).toBe('admin')
  })

  it('translates first-mention jargon in the configured eyebrow labels', () => {
    expect(CATEGORY_STYLE.ubs.label).toBe('UBS — posto de saúde')
    expect(CATEGORY_STYLE.mental.label).toBe('CAPS — saúde mental')
  })
})
