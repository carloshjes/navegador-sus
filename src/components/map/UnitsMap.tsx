import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import type { Marker as LeafletMarker } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { dataset } from '../../data/units'
import { isMappable } from '../../data/display-policy'
import { UNIT_TYPE_LABELS } from '../../data/labels'
import { markerIcon, markerVariant } from './markerIcons'

/** Roughly the center of Erechim's urban area. */
const ERECHIM_CENTER: [number, number] = [-27.636, -52.27]
const DEFAULT_ZOOM = 13
const FOCUS_ZOOM = 16

const mappableUnits = dataset.units.filter(isMappable)

/** Flies the map to the focused unit when the `focus` query param changes. */
function FocusController({ focusId }: { focusId: string | null }) {
  const map = useMap()
  useEffect(() => {
    if (!focusId) return
    const unit = mappableUnits.find((u) => u.id === focusId)
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
    const focused = focusId ? mappableUnits.find((u) => u.id === focusId) : undefined
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

      {mappableUnits.map((unit) => {
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
      })}
    </MapContainer>
  )
}
