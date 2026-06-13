/** Earth mean radius in metres (WGS-84 sphere approximation). */
const EARTH_RADIUS_M = 6_371_000

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180

export interface LatLng {
  lat: number
  lng: number
}

/**
 * Great-circle ("as the crow flies") distance between two points, in
 * metres, via the haversine formula. Straight-line only — it is NOT
 * walking/driving distance, which is why the UI labels results
 * "~X km em linha reta".
 */
export function haversineMeters(a: LatLng, b: LatLng): number {
  const dLat = toRadians(b.lat - a.lat)
  const dLng = toRadians(b.lng - a.lng)
  const lat1 = toRadians(a.lat)
  const lat2 = toRadians(b.lat)

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_RADIUS_M * Math.asin(Math.sqrt(h))
}

/** PT-BR straight-line distance label, e.g. "~1,2 km" or "~800 m". */
export function formatStraightLineDistance(meters: number): string {
  if (meters < 1000) {
    return `~${Math.round(meters / 10) * 10} m`
  }
  const km = meters / 1000
  return `~${km.toFixed(1).replace('.', ',')} km`
}
