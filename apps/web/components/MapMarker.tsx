import L from 'leaflet'

const locationTypeIcons: Record<string, string> = {
  CITY: '🏙',
  VILLAGE: '🏘',
  FORTRESS: '🏰',
  RUIN: '🏚',
  DUNGEON: '💀',
  LANDMARK: '🚩',
  SACRED_SITE: '⭐',
  CAMP: '⛺',
}

export interface MapMarkerOptions {
  type: string
  isCapital?: boolean
}

export function createMapMarkerIcon({ type, isCapital = false }: MapMarkerOptions): L.DivIcon {
  const emoji = locationTypeIcons[type] ?? '📍'
  const size = isCapital ? 28 : 20
  const fontSize = isCapital ? 22 : 16

  return L.divIcon({
    html: `<div style="
      font-size:${fontSize}px;
      filter:drop-shadow(0 1px 3px rgba(0,0,0,0.9));
      display:flex;
      align-items:center;
      justify-content:center;
      width:${size}px;
      height:${size}px;
      ${isCapital ? 'animation:float 3s ease-in-out infinite;' : ''}
    ">${emoji}</div>`,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  })
}

export const LOCATION_TYPE_ICONS = locationTypeIcons
