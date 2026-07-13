import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import type { Marker as LeafletMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { dataset } from '../../data/units'
import { UNIT_TYPE_LABELS } from '../../data/labels'
import { groupMappableUnitsByCoordinate } from '../../lib/hubs'
import { HubUnitList } from '../HubUnitList'
import { hubMarkerIcon, markerIcon, markerVariant } from './markerIcons'

/** Roughly the center of Erechim's urban area. */
const ERECHIM_CENTER: [number, number] = [-27.636, -52.27]
const DEFAULT_ZOOM = 13
const FOCUS_ZOOM = 16

const mappableGroups = groupMappableUnitsByCoordinate(dataset.units)

function findMappableUnit(focusId: string | null) {
  if (!focusId) return undefined
  for (const group of mappableGroups) {
    const unit = group.units.find((candidate) => candidate.id === focusId)
    if (unit) return unit
  }
  return undefined
}

/** Flies the map to the focused unit when the `focus` query param changes. */
function FocusController({ focusId }: { focusId: string | null }) {
  const map = useMap()
  useEffect(() => {
    const unit = findMappableUnit(focusId)
    if (unit && unit.coordinates.lat !== null) {
      map.flyTo([unit.coordinates.lat, unit.coordinates.lng], FOCUS_ZOOM)
    }
  }, [focusId, map])
  return null
}

export function UnitsMap({ focusId }: { focusId: string | null }) {
  const focusedMarker = useRef<LeafletMarker | null>(null)

  // Open the focused unit's popup after the marker AND its child <Popup>
  // have bound, and after the flyTo has settled. The short delay covers
  // both; the effect runs post-mount so the ref is already set.
  useEffect(() => {
    if (!focusId) return
    const timer = setTimeout(() => focusedMarker.current?.openPopup(), 350)
    return () => clearTimeout(timer)
  }, [focusId])

  const center = useMemo<[number, number]>(() => {
    const focused = findMappableUnit(focusId)
    if (focused && focused.coordinates.lat !== null) {
      return [focused.coordinates.lat, focused.coordinates.lng]
    }
    return ERECHIM_CENTER
  }, [focusId])

  return (
    <MapContainer
      center={center}
      zoom={focusId ? FOCUS_ZOOM : DEFAULT_ZOOM}
      scrollWheelZoom
      className="h-full w-full"
    >
      {/* Official OSM tiles. Attribution is mandatory (ODbL) and visible. */}
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; colaboradores do <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        maxZoom={19}
      />
      <FocusController focusId={focusId} />

      {mappableGroups.map((group) => {
        const firstUnit = group.units[0]
        if (!firstUnit) return null

        if (group.units.length === 1) {
          const unit = firstUnit
          const { lat, lng } = unit.coordinates
          if (lat === null) return null
          const isFocused = unit.id === focusId
          return (
            <Marker
              key={unit.id}
              position={[lat, lng]}
              icon={markerIcon(markerVariant(unit))}
              ref={isFocused ? focusedMarker : undefined}
              keyboard
              title={unit.name}
            >
              <Popup>
                <strong>{unit.name}</strong>
                <br />
                <span>{UNIT_TYPE_LABELS[unit.type]}</span>
                {markerVariant(unit) === 'planned' && (
                  <>
                    <br />
                    <span>Em construção — ainda não atende.</span>
                  </>
                )}
                {markerVariant(unit) === 'cautious' && (
                  <>
                    <br />
                    <span>Informações em verificação — ligue antes.</span>
                  </>
                )}
                <br />
                <Link to={`/unidade/${unit.id}`}>Ver detalhes →</Link>
              </Popup>
            </Marker>
          )
        }

        const label = `${group.units.length} unidades neste endereço`
        const containsFocus = group.units.some((unit) => unit.id === focusId)
        return (
          <Marker
            key={`hub-${group.key}`}
            position={group.position}
            icon={hubMarkerIcon(group.units.length)}
            ref={containsFocus ? focusedMarker : undefined}
            eventHandlers={{
              add: (event) => {
                const marker = event.target as LeafletMarker
                marker.getElement()?.setAttribute('aria-label', label)
              },
            }}
            keyboard
            title={label}
            zIndexOffset={1000}
          >
            <Popup minWidth={260} maxWidth={320} maxHeight={280}>
              <section aria-label={label}>
                <strong className="font-display text-title">
                  No mesmo endereço funcionam:
                </strong>
                <HubUnitList units={group.units} compact focusedId={focusId} showTypes />
              </section>
            </Popup>
          </Marker>
        )
      })}
    </MapContainer>
  )
}
