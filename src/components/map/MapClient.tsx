'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import { cn } from '@/lib/utils'

type PlaceCategory = 'FOOD' | 'ADMIN' | 'HEALTH' | 'CULTURE' | 'COMMUNITY'

interface Place {
  id: string
  name: string
  category: string
  lat: number
  lng: number
  city: string
  description: string | null
  addedBy: { name: string | null }
}

interface MapClientProps {
  places: Place[]
  defaultCity?: 'Paris' | 'Lyon'
  canAdd?: boolean
  onAddPlace?: (lat: number, lng: number) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  FOOD: '#D97706',
  ADMIN: '#2E3A8C',
  HEALTH: '#059669',
  CULTURE: '#7C3AED',
  COMMUNITY: '#DC2626',
}

const CATEGORY_LABELS: Record<string, string> = {
  FOOD: 'Food',
  ADMIN: 'Admin',
  HEALTH: 'Health',
  CULTURE: 'Culture',
  COMMUNITY: 'Community',
}

const CITY_CENTERS: Record<string, LatLngExpression> = {
  Paris: [48.8566, 2.3522],
  Lyon: [45.7578, 4.832],
}

function createPinIcon(category: string) {
  if (typeof window === 'undefined') return null
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet')
  const color = CATEGORY_COLORS[category] ?? '#1A1A1A'
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20S24 21 24 12C24 5.373 18.627 0 12 0z" fill="${color}" />
      <circle cx="12" cy="12" r="5" fill="#FAFAF7" />
    </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -32],
  })
}

function SetView({ center }: { center: LatLngExpression }) {
  const map = useMap()
  useEffect(() => { map.setView(center, 14) }, [center, map])
  return null
}

function MapClickHandler({ onAddPlace, addMode }: { onAddPlace?: (lat: number, lng: number) => void, addMode: boolean }) {
  useMapEvents({
    click: (e) => {
      if (addMode && onAddPlace) {
        onAddPlace(e.latlng.lat, e.latlng.lng)
      }
    },
  })
  return null
}

export default function MapClient({ places, defaultCity = 'Paris', canAdd, onAddPlace }: MapClientProps) {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(['FOOD', 'ADMIN', 'HEALTH', 'CULTURE', 'COMMUNITY'])
  )
  const [selectedCity, setSelectedCity] = useState<'Paris' | 'Lyon'>(defaultCity)
  const [isClient, setIsClient] = useState(false)
  const [addMode, setAddMode] = useState(false)

  useEffect(() => { setIsClient(true) }, [])

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) { next.delete(cat) } else { next.add(cat) }
      return next
    })
  }

  const filtered = places.filter(
    (p) => activeCategories.has(p.category) && p.city === selectedCity
  )

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted-bg">
        <span className="section-label">Loading map...</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 p-3 border-b border-border bg-background">
        <div className="flex items-center gap-1">
          {(['Paris', 'Lyon'] as const).map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCity(city)}
              className={cn(
                'px-3 py-1 text-xs uppercase tracking-widest border transition-all duration-150',
                selectedCity === city
                  ? 'bg-foreground text-background border-foreground'
                  : 'bg-background text-muted border-border hover:border-foreground hover:text-foreground'
              )}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-border" />

        <div className="flex flex-wrap items-center gap-2">
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => toggleCategory(key)}
              className={cn(
                'px-2 py-0.5 text-[10px] uppercase tracking-widest border transition-all duration-150',
                activeCategories.has(key)
                  ? 'border-foreground text-foreground'
                  : 'border-border text-muted'
              )}
              style={activeCategories.has(key) ? { borderColor: CATEGORY_COLORS[key], color: CATEGORY_COLORS[key] } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {canAdd && (
          <>
            <div className="h-4 w-px bg-border hidden md:block" />
            <button
              onClick={() => setAddMode(!addMode)}
              className={cn('btn-ghost text-xs', addMode && 'bg-foreground text-background border-foreground')}
            >
              {addMode ? 'Cancel' : '+ Add place'}
            </button>
          </>
        )}
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        {addMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-foreground text-background text-xs px-3 py-1.5 tracking-wide">
            Click on the map to add a place
          </div>
        )}
        <MapContainer
          center={CITY_CENTERS[selectedCity]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <SetView center={CITY_CENTERS[selectedCity]} />
          <MapClickHandler
            onAddPlace={(lat, lng) => { onAddPlace?.(lat, lng); setAddMode(false) }}
            addMode={addMode}
          />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((place) => {
            const icon = createPinIcon(place.category)
            return (
              <Marker key={place.id} position={[place.lat, place.lng]} icon={icon ?? undefined}>
                <Popup>
                  <div className="min-w-[160px]">
                    <div className="font-bold text-foreground text-xs mb-1">{place.name}</div>
                    <div
                      className="text-[10px] uppercase tracking-widest mb-1"
                      style={{ color: CATEGORY_COLORS[place.category] }}
                    >
                      {CATEGORY_LABELS[place.category]}
                    </div>
                    {place.description && (
                      <div className="text-[11px] text-muted leading-relaxed">{place.description}</div>
                    )}
                    <div className="text-[10px] text-muted mt-1.5 border-t border-border pt-1.5">
                      Added by {place.addedBy.name ?? 'community'}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      <div className="px-3 py-1.5 border-t border-border bg-background">
        <span className="text-[10px] text-muted">{filtered.length} place{filtered.length !== 1 ? 's' : ''} in {selectedCity}</span>
      </div>
    </div>
  )
}
