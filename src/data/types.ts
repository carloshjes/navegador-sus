/**
 * TypeScript model of the navegador-sus dataset (schema 0.2).
 *
 * Design principles (mirroring docs/relatorio-mapeamento.md):
 *  - explicit `null` = "we looked and could not confirm" — never use
 *    `undefined` to mean missing data;
 *  - discriminated unions make half-filled states unrepresentable
 *    (e.g. a latitude without a longitude cannot exist);
 *  - string-literal unions derived from `as const` arrays double as
 *    runtime vocabularies for data validation.
 */

/**
 * Confidence levels for volatile data (phone, hours, services, coverage).
 * `verified-local` is reserved for the user's phone-verification round:
 * data confirmed by calling the unit gets it, plus the call date.
 */
export const CONFIDENCE_LEVELS = [
  'official-recent', // official source, updated in 2026
  'official-stale', // official source, possibly outdated (undated page)
  'verified-local', // confirmed locally by phone/visit (round pending)
  'unverified', // not found in any source — verify before relying on it
] as const

export type Confidence = (typeof CONFIDENCE_LEVELS)[number]

/** Lifecycle of a unit in the dataset. Only `active` units are shown as such. */
export const UNIT_STATUSES = ['active', 'planned', 'deactivated', 'verify'] as const

export type UnitStatus = (typeof UNIT_STATUSES)[number]

/** Stable unit-type slugs (English keys; PT-BR labels live in the UI layer). */
export const UNIT_TYPES = [
  'ubs',
  'prison-health-unit',
  'health-post',
  'urgent-care',
  'mobile-emergency',
  'hospital',
  'specialty-center',
  'dental-specialty-center',
  'caps',
  'rehab-center',
  'public-pharmacy',
  'surveillance',
  'health-promotion',
  'administration',
] as const

export type UnitType = (typeof UNIT_TYPES)[number]

/**
 * Service taxonomy from the mapping report (§6) — the basis for the
 * phase-2 filters. Slugs are stable English keys.
 */
export const SERVICE_SLUGS = [
  'primary-care',
  'family-health-strategy',
  'pediatrics',
  'womens-health',
  'prenatal-care',
  'dentistry',
  'dental-specialties',
  'nursing-procedures',
  'vaccination',
  'lab-sample-collection',
  'rapid-testing',
  'cancer-screening',
  'medication-dispensing',
  'home-care',
  'specialty-consultations',
  'speech-therapy',
  'nutrition',
  'social-work',
  'physiotherapy-rehab',
  'mental-health',
  'psychosocial-care-adult',
  'psychosocial-care-alcohol-drugs',
  'psychosocial-care-children',
  'sti-hiv-care',
  'chronic-wound-care',
  'urgent-care',
  'hospital-emergency',
  'hospital-admission',
  'surgery',
  'maternity',
  'oncology',
  'dialysis',
  'imaging',
  'lab-tests',
  'mobile-emergency',
  'epidemiological-surveillance',
  'health-surveillance',
  'workers-health',
  'health-promotion',
  'regulation-administration',
] as const

export type ServiceSlug = (typeof SERVICE_SLUGS)[number]

/**
 * A volatile piece of data with its provenance. Discriminated by `value`:
 * either we KNOW it (and then source + check date are mandatory) or we
 * don't (and then there is nothing to misquote).
 */
export interface KnownField<T> {
  value: T
  source: string
  confidence: Confidence
  checkedAt: string // ISO date of the last verification
}

export interface UnknownField {
  value: null
  source: null
  confidence: 'unverified'
  checkedAt: null
}

export type ProvenancedField<T> = KnownField<T> | UnknownField

/**
 * Geographic position, discriminated by resolution state:
 *  - resolved: lat/lng pair with source and check date (a lone latitude
 *    cannot exist by construction); may carry `flag: 'suspect'` when the
 *    point falls outside the Erechim bounding box (manual review needed);
 *  - pending: nothing yet — flagged for manual geocoding.
 */
export interface ResolvedCoordinates {
  lat: number
  lng: number
  source: 'cnes' | 'osm-geocoding'
  checkedAt: string
  flag?: 'suspect'
}

export interface PendingCoordinates {
  lat: null
  lng: null
  source: null
  flag: 'geocode-manually'
}

export type Coordinates = ResolvedCoordinates | PendingCoordinates

export interface Address {
  street: string | null
  neighborhood: string | null
  city: string
  state: string
  zipCode: string | null
}

export interface HealthUnit {
  id: string
  /** CNES registry code, digits only; null when not yet registered. */
  cnesCode: string | null
  name: string
  type: UnitType
  status: UnitStatus
  /** Free text on purpose: real values mix sphere and management notes. */
  managedBy: string
  /** Present only on units that are not open to the general public. */
  accessRestriction?: string
  address: Address
  coordinates: Coordinates
  phone: ProvenancedField<string>
  email?: ProvenancedField<string>
  openingHours: ProvenancedField<string>
  services: ServiceSlug[]
  /** Caveat about how the services list was sourced. */
  servicesNote?: string
  coverageNeighborhoods: string[]
  /** e.g. FHSTE serves three health regions (~600k people). */
  regionalReference?: string
  /** Divergences between sources — recorded, never silently resolved. */
  conflicts: string[]
  openQuestions: string[]
  notes: string
  lastCnesUpdate: string | null
}

/** Emergency/contact channels that are not physical units (192, 193, 136...). */
export interface TransversalChannel {
  id: string
  name: string
  phone: ProvenancedField<string>
  url?: string
  notes?: string
  conflicts?: string[]
}

export interface DataSource {
  id: string
  label: string
  url: string
  consultedAt: string
  note?: string
}

export interface OutOfScopeEntry {
  name: string
  cnesCode: string | null
  reason: string
}

/** Root shape of src/data/unidades-saude-erechim.json. */
export interface HealthUnitsDataset {
  schemaVersion: string
  generatedAt: string
  scope: string
  schemaNotes: string[]
  sources: DataSource[]
  transversalChannels: TransversalChannel[]
  units: HealthUnit[]
  outOfScopeButRelevant: OutOfScopeEntry[]
}
