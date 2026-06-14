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
 * Visual kit §4: category color is config, not scattered ifs. These tests are
 * the safety net for that config — every category a citizen can see must
 * resolve to exactly one mapped color.
 */
describe('category colors (kit §3/§4)', () => {
  it('maps every unit type to a family that has a color style', () => {
    for (const type of UNIT_TYPES) {
      const style = CATEGORY_STYLE[categoryFamilyForType(type)]
      expect(style, type).toBeDefined()
      // The class is a real, solid cat-* fill (white text is AA by kit §3).
      expect(style.className, type).toMatch(/^bg-cat-/)
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
})
