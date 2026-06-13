import { useCallback, useState } from 'react'
import type { LatLng } from './geo'

/**
 * Browser geolocation, privacy by architecture (briefing §2): the
 * position is read ON THE DEVICE and used only to sort units by distance
 * here in the client. It is never sent anywhere, and there is no runtime
 * reverse geocoding (which would hand the position to a third party).
 */
export type GeolocationState =
  | { status: 'idle' }
  | { status: 'prompting' }
  | { status: 'granted'; position: LatLng }
  | { status: 'denied' }
  | { status: 'unavailable' }

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({ status: 'idle' })

  const request = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState({ status: 'unavailable' })
      return
    }
    setState({ status: 'prompting' })
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setState({
          status: 'granted',
          position: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        }),
      (err) =>
        setState({
          status: err.code === err.PERMISSION_DENIED ? 'denied' : 'unavailable',
        }),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
    )
  }, [])

  const reset = useCallback(() => setState({ status: 'idle' }), [])

  return { state, request, reset }
}
