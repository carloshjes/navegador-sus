import { describe, expect, it } from 'vitest'
import { UNIT_TYPES, SERVICE_SLUGS } from './types'
import {
  SERVICE_FILTER_PRIORITY,
  SERVICE_LABELS,
  TYPE_FILTER_PRIORITY,
  UNIT_TYPE_LABELS,
  UNIT_TYPE_SHORT_LABELS,
  serviceSummaryLabel,
} from './labels'

/*
 * Filter lists and active summaries need stable label coverage. These guards
 * also catch any future taxonomy change in src/data/types.ts that forgets to
 * touch the UI layer.
 */
describe('filter and summary labels', () => {
  it('has full and summary labels for every unit type', () => {
    for (const type of UNIT_TYPES) {
      expect(UNIT_TYPE_LABELS[type], type).toBeDefined()
      expect(UNIT_TYPE_SHORT_LABELS[type], type).toBeDefined()
    }
  })

  it('has a service label for every service slug', () => {
    for (const slug of SERVICE_SLUGS) {
      expect(SERVICE_LABELS[slug], slug).toBeDefined()
      // The summary falls back to SERVICE_LABELS — never empty.
      expect(serviceSummaryLabel(slug).length, slug).toBeGreaterThan(0)
    }
  })

  it('only lists real unit types under the type-filter priority', () => {
    const allTypes = new Set<string>(UNIT_TYPES)
    for (const type of TYPE_FILTER_PRIORITY) {
      expect(allTypes.has(type), type).toBe(true)
    }
    // Priority must not repeat a type (would duplicate a list option).
    expect(new Set(TYPE_FILTER_PRIORITY).size).toBe(TYPE_FILTER_PRIORITY.length)
  })

  it('only lists real service slugs under the service-filter priority', () => {
    const allServices = new Set<string>(SERVICE_SLUGS)
    for (const slug of SERVICE_FILTER_PRIORITY) {
      expect(allServices.has(slug), slug).toBe(true)
    }
    expect(new Set(SERVICE_FILTER_PRIORITY).size).toBe(SERVICE_FILTER_PRIORITY.length)
  })
})
