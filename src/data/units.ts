import rawDataset from './unidades-saude-erechim.json'
import type { HealthUnit, HealthUnitsDataset } from './types'

/**
 * Typed access to the dataset.
 *
 * The cast goes through `unknown` on purpose: TypeScript types the JSON
 * import with wide literals (plain `string` where the model wants a
 * literal union), so a direct `as` is rejected. The runtime guarantee
 * that the file really matches the model comes from the zod schema that
 * `npm test` runs (validate.test.ts), not from this line.
 */
export const dataset = rawDataset as unknown as HealthUnitsDataset

/**
 * Units the app may present as operating today. `planned`, `deactivated`
 * and `verify` are never counted or shown as active (mapping report §10).
 */
export const activeUnits: HealthUnit[] = dataset.units.filter(
  (unit) => unit.status === 'active',
)
