import { z } from 'zod'
import { CONFIDENCE_LEVELS, SERVICE_SLUGS, UNIT_STATUSES, UNIT_TYPES } from './types'

/**
 * Runtime validation of the dataset (zod). TypeScript types are erased at
 * compile time; this schema is what actually inspects the JSON content.
 * It runs as part of `npm test` (see validate.test.ts), so any edit that
 * breaks the 0.2 schema fails before reaching the app.
 *
 * `strictObject` is used everywhere on purpose: a misspelled key in the
 * JSON should be an error, not silently ignored data.
 */

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'expected YYYY-MM-DD')

/** Either we know the value (with source + check date) or we know nothing. */
const provenancedField = <T extends z.ZodType>(valueSchema: T) =>
  z.union([
    z.strictObject({
      value: valueSchema,
      source: z.string().min(1),
      confidence: z.enum(CONFIDENCE_LEVELS),
      checkedAt: isoDate,
    }),
    z.strictObject({
      value: z.null(),
      source: z.null(),
      confidence: z.literal('unverified'),
      checkedAt: z.null(),
    }),
  ])

const coordinatesSchema = z.union([
  z.strictObject({
    lat: z.number(),
    lng: z.number(),
    source: z.enum(['cnes', 'osm-geocoding', 'manual-map-check', 'shared-address']),
    checkedAt: isoDate,
    flag: z.literal('suspect').optional(),
    crossCheck: z.enum(['ok', 'unconfirmed']).optional(),
  }),
  z.strictObject({
    lat: z.null(),
    lng: z.null(),
    source: z.null(),
    flag: z.literal('geocode-manually'),
  }),
])

const addressSchema = z.strictObject({
  street: z.string().nullable(),
  neighborhood: z.string().nullable(),
  city: z.string(),
  state: z.string(),
  zipCode: z.string().nullable(),
})

const healthUnitSchema = z.strictObject({
  id: z.string().min(1),
  cnesCode: z.string().regex(/^\d+$/).nullable(),
  name: z.string().min(1),
  type: z.enum(UNIT_TYPES),
  status: z.enum(UNIT_STATUSES),
  managedBy: z.string().min(1),
  accessRestriction: z.string().optional(),
  address: addressSchema,
  coordinates: coordinatesSchema,
  phone: provenancedField(z.string().min(1)),
  email: provenancedField(z.string().email()).optional(),
  openingHours: provenancedField(z.string().min(1)),
  services: z.array(z.enum(SERVICE_SLUGS)),
  servicesNote: z.string().optional(),
  coverageNeighborhoods: z.array(z.string()),
  regionalReference: z.string().optional(),
  conflicts: z.array(z.string()),
  openQuestions: z.array(z.string()),
  notes: z.string(),
  lastCnesUpdate: isoDate.nullable(),
})

const transversalChannelSchema = z.strictObject({
  id: z.string().min(1),
  name: z.string().min(1),
  phone: provenancedField(z.string().min(1)),
  url: z.string().url().optional(),
  notes: z.string().optional(),
  conflicts: z.array(z.string()).optional(),
})

const dataSourceSchema = z.strictObject({
  id: z.string().min(1),
  label: z.string().min(1),
  url: z.string().url(),
  consultedAt: isoDate,
  note: z.string().optional(),
})

const outOfScopeEntrySchema = z.strictObject({
  name: z.string().min(1),
  cnesCode: z.string().regex(/^\d+$/).nullable(),
  reason: z.string().min(1),
})

export const datasetSchema = z.strictObject({
  schemaVersion: z.string(),
  generatedAt: isoDate,
  scope: z.string(),
  schemaNotes: z.array(z.string()),
  sources: z.array(dataSourceSchema),
  transversalChannels: z.array(transversalChannelSchema),
  units: z.array(healthUnitSchema),
  outOfScopeButRelevant: z.array(outOfScopeEntrySchema),
})

export type DatasetFromSchema = z.infer<typeof datasetSchema>
