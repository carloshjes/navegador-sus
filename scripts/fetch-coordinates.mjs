/**
 * fetch-coordinates — resolves unit coordinates from the CNES open-data API.
 *
 * Plan documented in docs/relatorio-mapeamento.md §7:
 *   GET https://apidadosabertos.saude.gov.br/cnes/estabelecimentos/{code}
 *   (code WITHOUT leading zeros) and read
 *   latitude_estabelecimento_decimo_grau / longitude_estabelecimento_decimo_grau.
 *
 * Rules:
 *  - success  -> { lat, lng, source: "cnes", checkedAt: <today> }, drop the
 *    "geocode-manually" flag;
 *  - sanity guard: a point outside the Erechim bounding box is NOT accepted
 *    silently — it keeps the coordinates but gains flag "suspect";
 *  - failure/absence -> keep "geocode-manually" untouched (no data invented);
 *  - ~1s delay between requests (courtesy to a public API).
 *
 * Run: npm run fetch:coordinates  (rewrites src/data/unidades-saude-erechim.json)
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const DATASET_PATH = fileURLToPath(
  new URL('../src/data/unidades-saude-erechim.json', import.meta.url),
)

const API_BASE = 'https://apidadosabertos.saude.gov.br/cnes/estabelecimentos'

// Erechim bounding box (Etapa 1 prompt): lat -27.45..-27.95, lng -52.05..-52.55.
const BBOX = { latMax: -27.45, latMin: -27.95, lngMax: -52.05, lngMin: -52.55 }

const REQUEST_DELAY_MS = 1000
const REQUEST_TIMEOUT_MS = 20000

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const today = new Date().toISOString().slice(0, 10)

const insideErechimBox = (lat, lng) =>
  lat >= BBOX.latMin && lat <= BBOX.latMax && lng >= BBOX.lngMin && lng <= BBOX.lngMax

/** @returns {{ ok: true, lat: number, lng: number } | { ok: false, reason: string }} */
async function fetchCoordinates(cnesCode) {
  const codeWithoutLeadingZeros = String(Number(cnesCode))
  let response
  try {
    response = await fetch(`${API_BASE}/${codeWithoutLeadingZeros}`, {
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (error) {
    return { ok: false, reason: `network error: ${error.message}` }
  }

  if (!response.ok) {
    return { ok: false, reason: `HTTP ${response.status}` }
  }

  let body
  try {
    body = await response.json()
  } catch {
    return { ok: false, reason: 'response was not valid JSON' }
  }

  const lat = body?.latitude_estabelecimento_decimo_grau
  const lng = body?.longitude_estabelecimento_decimo_grau

  if (typeof lat !== 'number' || typeof lng !== 'number' || (lat === 0 && lng === 0)) {
    return { ok: false, reason: 'coordinates absent from CNES record' }
  }

  return { ok: true, lat, lng }
}

const dataset = JSON.parse(readFileSync(DATASET_PATH, 'utf8'))

const resolved = []
const suspects = []
const pending = []

for (const unit of dataset.units) {
  if (!unit.cnesCode) {
    pending.push(`${unit.id} — no cnesCode (kept geocode-manually)`)
    continue
  }

  const result = await fetchCoordinates(unit.cnesCode)

  if (!result.ok) {
    pending.push(`${unit.id} — ${result.reason} (kept geocode-manually)`)
  } else if (!insideErechimBox(result.lat, result.lng)) {
    // Outside the sanity box: record but mark for manual review.
    unit.coordinates = {
      lat: result.lat,
      lng: result.lng,
      source: 'cnes',
      checkedAt: today,
      flag: 'suspect',
    }
    suspects.push(`${unit.id} — (${result.lat}, ${result.lng}) outside Erechim box`)
  } else {
    unit.coordinates = {
      lat: result.lat,
      lng: result.lng,
      source: 'cnes',
      checkedAt: today,
    }
    resolved.push(`${unit.id} — (${result.lat}, ${result.lng})`)
  }

  await sleep(REQUEST_DELAY_MS)
}

writeFileSync(DATASET_PATH, JSON.stringify(dataset, null, 2) + '\n', 'utf8')

const section = (title, lines) => {
  console.log(`\n${title} (${lines.length})`)
  for (const line of lines) console.log(`  ${line}`)
}

section('RESOLVED', resolved)
section('SUSPECT — review manually', suspects)
section('PENDING — still geocode-manually', pending)
console.log(
  `\nTotal: ${dataset.units.length} units | resolved ${resolved.length} | suspect ${suspects.length} | pending ${pending.length}`,
)
