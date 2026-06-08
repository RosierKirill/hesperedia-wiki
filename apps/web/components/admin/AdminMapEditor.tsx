'use client'

import { useEffect } from 'react'
import { MapContainer, ImageOverlay, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { createMapMarkerIcon } from '@/components/MapMarker'

const MAP_BOUNDS: [[number, number], [number, number]] = [[0, 0], [800, 1000]]

interface LocationItem {
  id?: string
  name: string
  slug?: string
  type: string
  realmId?: string
  regionId?: string
  description?: string
  isCapital?: boolean
  mapCoords?: { x: number; y: number }
}

interface AdminMapEditorProps {
  locations: LocationItem[]
  onMapClick: (coords: { x: number; y: number }) => void
  onLocationClick: (loc: LocationItem) => void
}

function ClickHandler({ onMapClick }: { onMapClick: (coords: { x: number; y: number }) => void }) {
  useMapEvents({
    click(e) {
      const x = Math.round(e.latlng.lng)
      const y = Math.round(800 - e.latlng.lat)
      onMapClick({ x, y })
    },
  })
  return null
}

export default function AdminMapEditor({ locations, onMapClick, onLocationClick }: AdminMapEditorProps) {
  useEffect(() => {
    // Patch leaflet default icon issue with Next.js
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/leaflet/marker-icon-2x.png',
      iconUrl: '/leaflet/marker-icon.png',
      shadowUrl: '/leaflet/marker-shadow.png',
    })
  }, [])

  const validLocations = locations.filter((l) => l.mapCoords?.x != null)

  return (
    <MapContainer
      crs={L.CRS.Simple}
      bounds={MAP_BOUNDS}
      style={{ width: '100%', height: '100%', background: '#0D0D0D', cursor: 'crosshair' }}
      maxZoom={3}
      minZoom={-1}
    >
      <ImageOverlay url="/maps/hesperedia.svg" bounds={MAP_BOUNDS} opacity={0.9} />
      <ClickHandler onMapClick={onMapClick} />
      {validLocations.map((loc, i) => (
        <Marker
          key={loc.id ?? i}
          position={[800 - loc.mapCoords!.y, loc.mapCoords!.x] as [number, number]}
          icon={createMapMarkerIcon({ type: loc.type, isCapital: loc.isCapital })}
          eventHandlers={{
            click: () => onLocationClick(loc),
          }}
        />
      ))}
    </MapContainer>
  )
}
