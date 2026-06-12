import type { HealthUnit, UnitType } from './types'

/**
 * Display policy: how each unit appears in the UI, derived from the
 * mapping report §10 and the Etapa 2 prompt. This is CONFIG, not UI
 * code — pages must consult displayCategory() instead of scattering
 * status/type ifs. Every rule here is covered by display-policy.test.ts.
 */

export type DisplayCategory =
  /** Listed normally in the main care directory. */
  | 'care'
  /** Listed without highlight, with the access restriction made obvious. */
  | 'care-restricted'
  /** Listed showing only confirmed data; call-ahead warnings everywhere. */
  | 'care-cautious'
  /** Planned/under construction: "em breve" section, never active. */
  | 'coming-soon'
  /** Management/surveillance bodies: secondary institutional section. */
  | 'institutional'
  /** Never rendered anywhere in the app. */
  | 'hidden'

/**
 * `status: "verify"` units are hidden by default (we cannot vouch for
 * them). The PA is the single, deliberate exception: the prefecture
 * confirms it exists and it matters for urgent care, so it is shown
 * under maximum caution (report conflict #1 — never mention "24h").
 */
const VERIFY_SHOWN_WITH_CAUTION = new Set(['pronto-atendimento-umrs'])

/**
 * Institutional by id: CEREST is typed `specialty-center` in the dataset
 * but the report (§3) groups it under surveillance/management and the
 * Etapa 2 prompt lists it with the institutional bodies.
 */
const INSTITUTIONAL_BY_ID = new Set(['cerest-alto-uruguai'])

export function displayCategory(unit: HealthUnit): DisplayCategory {
  if (unit.status === 'deactivated') return 'hidden'
  if (unit.status === 'verify') {
    return VERIFY_SHOWN_WITH_CAUTION.has(unit.id) ? 'care-cautious' : 'hidden'
  }
  if (unit.status === 'planned') return 'coming-soon'
  if (
    unit.type === 'administration' ||
    unit.type === 'surveillance' ||
    INSTITUTIONAL_BY_ID.has(unit.id)
  ) {
    return 'institutional'
  }
  if (unit.accessRestriction) return 'care-restricted'
  return 'care'
}

/** Hidden units must not even have a detail page (deep links 404). */
export function isLinkable(unit: HealthUnit): boolean {
  return displayCategory(unit) !== 'hidden'
}

/**
 * Stable, predictable listing order: citizen-facing relevance first
 * (entry doors, urgency, hospitals), then specialty network. Ties break
 * by PT-BR name. The restricted prison unit sorts last among care units
 * ("sem destaque" — Etapa 2 prompt).
 */
const TYPE_SORT_ORDER: readonly UnitType[] = [
  'ubs',
  'health-post',
  'urgent-care',
  'hospital',
  'public-pharmacy',
  'specialty-center',
  'dental-specialty-center',
  'caps',
  'rehab-center',
  'health-promotion',
  'mobile-emergency',
  'prison-health-unit',
  'surveillance',
  'administration',
]

export function compareUnitsForListing(a: HealthUnit, b: HealthUnit): number {
  const typeDelta = TYPE_SORT_ORDER.indexOf(a.type) - TYPE_SORT_ORDER.indexOf(b.type)
  if (typeDelta !== 0) return typeDelta
  return a.name.localeCompare(b.name, 'pt-BR')
}

/**
 * User-facing PT-BR notices for restricted units. The dataset stores
 * prose in accent-stripped ASCII (research artifact); UI copy needs
 * proper Portuguese, so presentation text lives here — same meaning,
 * no data values changed.
 */
export const RESTRICTION_NOTICES: Readonly<Partial<Record<string, string>>> = {
  'ubs-prisional':
    'Atendimento exclusivo à população privada de liberdade — não é porta de entrada para o público geral.',
}

/**
 * Search aliases — alternate spellings users may type, WITHOUT touching
 * the canonical JSON. Sources: Etapa 0 conflict #5 (Estevam/Estevão) and
 * the old "DST" acronym still on the CNES record of the SAE.
 */
export const SEARCH_ALIASES: Readonly<Partial<Record<string, readonly string[]>>> = {
  'ubs-estevam-carraro': ['UBS Estevão Carraro'],
  'sae-ist-hiv': ['DST'],
  'caps-infanto-juvenil': ['CAPS infantil'],
}
