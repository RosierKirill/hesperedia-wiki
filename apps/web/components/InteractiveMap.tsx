'use client'

import { useState } from 'react'
import { MapContainer, ImageOverlay, Marker, Popup, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLocations, useRealms } from '@/hooks/useApi'
import { cn } from '@/lib/utils'
import Link from 'next/link'

const MAP_BOUNDS: [[number, number], [number, number]] = [[0, 0], [800, 1000]]

const locationTypeIcons: Record<string, string> = {
  CITY: '🏙', VILLAGE: '🏘', FORTRESS: '🏰', RUIN: '🏚',
  DUNGEON: '💀', LANDMARK: '🚩', SACRED_SITE: '⭐', CAMP: '⛺',
}

function createCustomIcon(type: string, isCapital: boolean): L.DivIcon {
  return L.divIcon({
    html: `<div style="font-size:${isCapital ? '22px' : '16px'};filter:drop-shadow(0 1px 2px rgba(0,0,0,0.8))">${locationTypeIcons[type] ?? '📍'}</div>`,
    className: '',
    iconSize: [isCapital ? 28 : 20, isCapital ? 28 : 20],
    iconAnchor: [isCapital ? 14 : 10, isCapital ? 14 : 10],
  })
}

interface LocationItem {
  id: string
  slug: string
  name: string
  type: string
  isCapital: boolean
  description?: string
  mapCoords?: { x: number; y: number }
  region?: { name: string }
}

interface RealmItem {
  id: string
  slug: string
  name: string
  color?: string
}

export function InteractiveMap() {
  const [selectedRealm, setSelectedRealm] = useState<string>('')
  const { data: locations } = useLocations(selectedRealm ? { realmId: selectedRealm } : undefined)
  const { data: realms } = useRealms()

  const validLocations = (locations as LocationItem[] ?? []).filter((l) => l.mapCoords?.x != null)

  return (
    <div className="relative w-full h-full bg-nihil-900">
      <MapContainer
        crs={L.CRS.Simple}
        bounds={MAP_BOUNDS}
        style={{ width: '100%', height: '100%', background: '#0D0D0D' }}
        maxZoom={3}
        minZoom={-1}
      >
        <ImageOverlay
          url="/maps/hesperedia.svg"
          bounds={MAP_BOUNDS}
          opacity={0.9}
        />
        {validLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[800 - loc.mapCoords!.y, loc.mapCoords!.x] as [number, number]}
            icon={createCustomIcon(loc.type, loc.isCapital)}
          >
            <Popup>
              <div className="min-w-[180px] font-sans">
                <p className="font-bold text-sm mb-1">{loc.name}</p>
                {loc.region && <p className="text-xs text-gray-500 mb-1">{loc.region.name}</p>}
                {loc.description && <p className="text-xs text-gray-700 mb-2 line-clamp-3">{loc.description}</p>}
                <Link href={`/map/${loc.slug}`} className="text-xs text-blue-600 hover:underline">
                  Voir les détails →
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Realm switcher overlay */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <div className="bg-nihil-900/90 backdrop-blur rounded-lg border border-nihil-700 p-3 space-y-2">
          <p className="text-xs font-ui text-parchment-500 uppercase tracking-widest">Royaume</p>
          <button
            onClick={() => setSelectedRealm('')}
            className={cn(
              'block w-full text-left px-2 py-1 rounded text-sm font-ui transition-colors',
              !selectedRealm
                ? 'bg-lumen-600 text-white'
                : 'text-parchment-300 hover:bg-nihil-800',
            )}
          >
            Tous les Royaumes
          </button>
          {(realms as RealmItem[] ?? []).map((realm) => (
            <button
              key={realm.id}
              onClick={() => setSelectedRealm(realm.id === selectedRealm ? '' : realm.id)}
              className={cn(
                'block w-full text-left px-2 py-1 rounded text-sm font-ui transition-colors flex items-center gap-2',
                realm.id === selectedRealm
                  ? 'text-white'
                  : 'text-parchment-300 hover:bg-nihil-800',
              )}
              style={realm.id === selectedRealm ? { backgroundColor: realm.color ?? '#D4A017' } : {}}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: realm.color ?? '#D4A017' }}
              />
              {realm.name}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <div className="bg-nihil-900/90 backdrop-blur rounded-lg border border-nihil-700 p-3">
          <p className="text-xs font-ui text-parchment-500 uppercase tracking-widest mb-2">Légende</p>
          <div className="space-y-1">
            {Object.entries(locationTypeIcons).map(([type, icon]) => (
              <div key={type} className="flex items-center gap-2 text-xs font-ui text-parchment-400">
                <span>{icon}</span>
                <span>{type.charAt(0) + type.slice(1).toLowerCase()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
