import L from 'leaflet'
import type { HealthUnit } from '../../data/types'
import { displayCategory } from '../../data/display-policy'

/**
 * Marker variants. Color is NEVER the only signal (WCAG 1.4.1): the popup
 * text and the map legend carry the meaning; color only reinforces it.
 */
export type MarkerVariant = 'care' | 'cautious' | 'planned'

export function markerVariant(unit: HealthUnit): MarkerVariant {
  const category = displayCategory(unit)
  if (category === 'coming-soon') return 'planned'
  if (category === 'care-cautious') return 'cautious'
  return 'care'
}

/* Leaflet inserts this SVG into the document, where root theme variables
   resolve normally. Keeping every variant tokenized prevents the map pins
   from drifting when the palette changes. */
const VARIANT_COLOR: Record<MarkerVariant, string> = {
  care: 'var(--color-primary)',
  cautious: 'var(--color-conf-warn)',
  planned: 'var(--color-ink-muted)',
}

const teardropSvg = (color: string): string =>
  `<svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path d="M14 0C6.27 0 0 6.27 0 14c0 9.5 14 22 14 22s14-12.5 14-22C28 6.27 21.73 0 14 0z" fill="${color}" stroke="var(--color-white)" stroke-width="2"/>
    <circle cx="14" cy="14" r="5" fill="var(--color-white)"/>
  </svg>`

const iconCache = new Map<MarkerVariant, L.DivIcon>()
const hubIconCache = new Map<number, L.DivIcon>()

/** Cached teardrop icon per variant (divIcon avoids the Leaflet/bundler
    marker-image pitfall entirely — no PNG assets to resolve). */
export function markerIcon(variant: MarkerVariant): L.DivIcon {
  const cached = iconCache.get(variant)
  if (cached) return cached
  const icon = L.divIcon({
    className: 'nav-marker',
    html: teardropSvg(VARIANT_COLOR[variant]),
    iconSize: [28, 36],
    iconAnchor: [14, 36], // tip of the teardrop
    popupAnchor: [0, -34],
  })
  iconCache.set(variant, icon)
  return icon
}

/** Primary multi-unit pin with a visible count badge. */
export function hubMarkerIcon(count: number): L.DivIcon {
  const cached = hubIconCache.get(count)
  if (cached) return cached
  const icon = L.divIcon({
    className: 'nav-marker nav-hub-marker',
    html: `${teardropSvg('var(--color-primary)')}<span aria-hidden="true" class="nav-hub-marker__badge">${count}</span>`,
    iconSize: [44, 44],
    iconAnchor: [14, 44],
    popupAnchor: [0, -42],
  })
  hubIconCache.set(count, icon)
  return icon
}
