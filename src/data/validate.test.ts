import { describe, expect, it } from 'vitest'
import rawDataset from './unidades-saude-erechim.json'
import { datasetSchema, type DatasetFromSchema } from './schema'
import type { HealthUnitsDataset } from './types'

/*
 * Compile-time drift guard: the handwritten model (types.ts) and the zod
 * schema (schema.ts) must describe the same shape. If either changes
 * alone, one of these assignments stops compiling during `npm run build`.
 */
const schemaSatisfiesModel: HealthUnitsDataset = {} as DatasetFromSchema
const modelSatisfiesSchema: DatasetFromSchema = {} as HealthUnitsDataset
void schemaSatisfiesModel
void modelSatisfiesSchema

describe('dataset conforms to schema 0.2', () => {
  it('validates src/data/unidades-saude-erechim.json against the zod schema', () => {
    const result = datasetSchema.safeParse(rawDataset)

    if (!result.success) {
      const report = result.error.issues
        .map((issue) => `  ${issue.path.join('.')}: ${issue.message}`)
        .join('\n')
      throw new Error(`dataset failed schema validation:\n${report}`)
    }

    expect(result.success).toBe(true)
  })
})
