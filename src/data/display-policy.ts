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
 * The seven category families of the visual kit (§3). Each gets one solid
 * color (a wayfinding signal), kept here — typed config, not scattered ifs —
 * so the presentation layer (CategoryTag) reads one map. Color values and
 * PT-BR labels live in src/lib/category-style.ts (presentation); this module
 * owns the type→family logic, which is data policy.
 */
export type CategoryFamily =
  | 'ubs'
  | 'urgency'
  | 'hospital'
  | 'mental'
  | 'specialty'
  | 'pharmacy'
  | 'admin'

/** Every unit type maps to exactly one family (total record — the compiler
    enforces coverage; category-style.test.ts enforces a color for each). */
const UNIT_TYPE_FAMILY: Record<UnitType, CategoryFamily> = {
  ubs: 'ubs',
  'health-post': 'ubs',
  'prison-health-unit': 'ubs',
  'urgent-care': 'urgency',
  'mobile-emergency': 'urgency',
  hospital: 'hospital',
  caps: 'mental',
  'specialty-center': 'specialty',
  'dental-specialty-center': 'specialty',
  'rehab-center': 'specialty',
  'public-pharmacy': 'pharmacy',
  surveillance: 'admin',
  'health-promotion': 'admin',
  administration: 'admin',
}

export function categoryFamilyForType(type: UnitType): CategoryFamily {
  return UNIT_TYPE_FAMILY[type]
}

/**
 * Category family of a unit. Mirrors the institutional override in
 * displayCategory(): CEREST is typed `specialty-center` but the report
 * groups it with the management bodies, so it reads as `admin`.
 */
export function categoryFamily(unit: HealthUnit): CategoryFamily {
  if (INSTITUTIONAL_BY_ID.has(unit.id)) return 'admin'
  return UNIT_TYPE_FAMILY[unit.type]
}

/** Care-facing categories — the units a citizen might physically visit. */
const MAPPABLE_CATEGORIES: ReadonlySet<DisplayCategory> = new Set([
  'care',
  'care-restricted',
  'care-cautious',
  'coming-soon',
])

/**
 * Whether a unit may be plotted on the map. Requires (a) a care-facing
 * category — management/surveillance bodies and hidden units stay off the
 * map — and (b) a VERIFIED coordinate: corroborated (crossCheck) or a
 * human-decided/derived point (manual-map-check, osm-geocoding,
 * shared-address). A bare CNES point with no cross-check, an unresolved
 * `suspect` flag, or a pending coordinate is NOT plotted (Etapa 3,
 * Tarefa 1: "map only takes a checked coordinate"). This leaves SAMU
 * (a phone channel), the prison unit and the address-less rehab unit
 * off the map by construction.
 */
export function isMappable(unit: HealthUnit): boolean {
  if (!MAPPABLE_CATEGORIES.has(displayCategory(unit))) return false
  const c = unit.coordinates
  if (c.lat === null) return false
  if (c.flag === 'suspect') return false
  return c.crossCheck != null || c.source !== 'cnes'
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
