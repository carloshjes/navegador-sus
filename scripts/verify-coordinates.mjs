/**
 * verify-coordinates — cross-checks each unit's CNES coordinate against an
 * independent geocode of its address (Nominatim/OpenStreetMap), per the
 * Etapa 3 plan (relatorio §7).
 *
 * For every unit that has BOTH a coordinate and a street:
 *   1. geocode the address via Nominatim (1 req/s, identifying User-Agent);
 *   2. measure the haversine distance to the CNES point.
 *      - <= 500 m  -> two independent sources agree: write crossCheck "ok"
 *        (keep source "cnes");
 *      - >  500 m  -> add to the DIVERGENCE REPORT (unit, CNES point, OSM
 *        point, distance, ficha/OSM links) for the human-in-the-loop step.
 *
 * The script NEVER overwrites a coordinate on its own. Divergences are
 * decided by the user; "ok" cross-checks are the only thing it writes.
 *
 * Run: node scripts/verify-coordinates.mjs
 *   --report-only   do not write anything, just print the report
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const PATH = fileURLToPath(
  new URL('../src/data/unidades-saude-erechim.json', import.meta.url),
)

const NOMINATIM = 'https://nominatim.openstreetmap.org/search'
const USER_AGENT =
  'navegador-sus/0.1 (public health facility directory for Erechim/RS; https://github.com/carloshjes/navegador-sus)'
const AGREEMENT_THRESHOLD_M = 500
const REQUEST_DELAY_MS = 1100 // > 1 req/s, Nominatim usage policy

const reportOnly = process.argv.includes('--report-only')
const today = new Date().toISOString().slice(0, 10)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

// Canonical haversine lives in src/lib/geo.ts (typed + unit-tested);
// reproduced here because this is a plain Node script.
function haversineMeters(a, b) {
  const R = 6_371_000
  const toRad = (d) => (d * Math.PI) / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

/**
 * Build geocoder queries from the messy address fields, most precise
 * first. Nominatim has poor house-number coverage in Erechim, so we fall
 * back to the street centroid (no number) — coarser, but enough to
 * corroborate a point within ~500 m for short streets. Distinct entries
 * only (district street == neighborhood would duplicate).
 */
function addressQueries(unit) {
  const cleaned = unit.address.street
    .replace(/\([^)]*\)/g, ' ') // drop "(Acesso 01)", "(sede do distrito)"
    .replace(/,?\s*s\/n\b/gi, ' ') // drop ", s/n"
    .replace(/\s+/g, ' ')
    .trim()
  const noNumber = cleaned.replace(/,?\s*\d+\s*$/, '').trim()
  // OSM sometimes catalogs a different street-type prefix than the
  // official data ("Avenida Santo Dal Bosco" in CNES vs "Rua Santo dal
  // Bosco" in OSM), so try without the Rua/Avenida/... prefix too.
  const noType = noNumber.replace(/^(rua|avenida|av\.?|r\.?|travessa|estrada|rodovia)\s+/i, '').trim()
  // Last resort: the POI name itself — rescues units whose street name is
  // spelled differently in OSM (e.g. Kramer/Kraemer). Drop the trailing
  // "- expansion" and parentheticals.
  const nameClean = unit.name
    .replace(/\([^)]*\)/g, ' ')
    .replace(/\s*[-–].*$/, '')
    .replace(/\s+/g, ' ')
    .trim()
  const hood = unit.address.neighborhood
  const tail = (parts) => [...parts, 'Erechim', 'RS', 'Brazil'].filter(Boolean).join(', ')

  const candidates = [
    tail([cleaned, hood]),
    tail([noNumber, hood]),
    tail([noNumber]),
    tail([noType, hood]),
    tail([noType]),
    tail([nameClean]),
  ]
  return [...new Set(candidates)]
}

async function geocodeOne(query) {
  const url = `${NOMINATIM}?format=jsonv2&limit=1&countrycodes=br&q=${encodeURIComponent(query)}`
  const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } })
  if (!res.ok) return { error: `HTTP ${res.status}` }
  const body = await res.json()
  if (!Array.isArray(body) || body.length === 0) return null
  return { lat: Number(body[0].lat), lng: Number(body[0].lon), matched: query }
}

/** Try queries in order (precise first), 1 req/s, until one resolves. */
async function geocode(unit) {
  for (const query of addressQueries(unit)) {
    const hit = await geocodeOne(query)
    await sleep(REQUEST_DELAY_MS)
    if (hit && !hit.error) return hit
  }
  return { error: 'no result' }
}

const cnesFichaUrl = (code) =>
  `https://cnes.datasus.gov.br/pages/estabelecimentos/ficha/identificacao/${code}`
const osmUrl = (lat, lng) => `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`

const dataset = JSON.parse(readFileSync(PATH, 'utf8'))

const agreed = []
const divergences = []
const notGeocoded = []
const skippedNoAddress = []
const pending = []

for (const unit of dataset.units) {
  if (unit.coordinates.lat === null) {
    pending.push(`${unit.id} (${unit.coordinates.flag})`)
    continue
  }
  if (!unit.address.street) {
    skippedNoAddress.push(unit.id)
    continue
  }

  const result = await geocode(unit)

  if (result.error) {
    notGeocoded.push(`${unit.id} — ${result.error}`)
    continue
  }

  const cnes = { lat: unit.coordinates.lat, lng: unit.coordinates.lng }
  const distance = haversineMeters(cnes, result)

  if (distance <= AGREEMENT_THRESHOLD_M) {
    unit.coordinates.crossCheck = 'ok'
    agreed.push(`${unit.id} — ${Math.round(distance)} m (via "${result.matched}")`)
  } else {
    divergences.push({
      id: unit.id,
      name: unit.name,
      cnes,
      cnesCode: unit.cnesCode,
      osm: result,
      matched: result.matched,
      distanceKm: (distance / 1000).toFixed(2),
      flag: unit.coordinates.flag ?? null,
    })
  }
}

if (!reportOnly) {
  writeFileSync(PATH, JSON.stringify(dataset, null, 2) + '\n', 'utf8')
}

const line = (s) => console.log(s)
line(`\n=== CROSS-CHECK OK (<= ${AGREEMENT_THRESHOLD_M} m, crossCheck written) (${agreed.length}) ===`)
agreed.forEach((a) => line('  ' + a))

line(`\n=== DIVERGENCES (> ${AGREEMENT_THRESHOLD_M} m — need human decision) (${divergences.length}) ===`)
for (const d of divergences) {
  line(`\n  ${d.id}${d.flag ? ` [${d.flag}]` : ''} — ${d.name}`)
  line(`    distance CNES↔OSM: ${d.distanceKm} km`)
  line(`    CNES: ${d.cnes.lat}, ${d.cnes.lng}`)
  line(`    OSM : ${d.osm.lat}, ${d.osm.lng}  (via "${d.matched}")`)
  if (d.cnesCode) line(`    ficha CNES: ${cnesFichaUrl(d.cnesCode)}`)
  line(`    CNES no mapa: ${osmUrl(d.cnes.lat, d.cnes.lng)}`)
  line(`    OSM  no mapa: ${osmUrl(d.osm.lat, d.osm.lng)}`)
}

line(`\n=== COULD NOT GEOCODE (no cross-check) (${notGeocoded.length}) ===`)
notGeocoded.forEach((n) => line('  ' + n))

line(`\n=== SKIPPED: no street address (${skippedNoAddress.length}) ===`)
line('  ' + skippedNoAddress.join(', '))

line(`\n=== PENDING: no coordinate (${pending.length}) ===`)
line('  ' + pending.join(', '))

line(`\nWrote crossCheck for ${agreed.length} units${reportOnly ? ' (REPORT ONLY — nothing written)' : ''}.`)
line(`checkedAt would be: ${today}`)
