'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { cn } from '@/lib/utils'

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

interface NominatimResult {
  place_id: number
  display_name: string
  name: string
  lat: string
  lon: string
  type: string
  class: string
}

interface MapClientProps {
  places: Place[]
  defaultCity?: string
  defaultCenter?: [number, number]
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

const PARIS_CENTER: [number, number] = [48.8566, 2.3522]

function createPinIcon(category: string) {
  if (typeof window === 'undefined') return null
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const L = require('leaflet')
  const color = CATEGORY_COLORS[category] ?? '#1A1A1A'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32">
    <path d="M12 0C5.373 0 0 5.373 0 12c0 9 12 20 12 20S24 21 24 12C24 5.373 18.627 0 12 0z" fill="${color}" />
    <circle cx="12" cy="12" r="5" fill="#F4EFE6" />
  </svg>`
  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [24, 32],
    iconAnchor: [12, 32],
    popupAnchor: [0, -32],
  })
}

// Calls invalidateSize after mount so tiles render correctly in flex containers
function InvalidateSizeOnMount() {
  const map = useMap()
  useEffect(() => {
    const t = setTimeout(() => map.invalidateSize(), 150)
    return () => clearTimeout(t)
  }, [map])
  return null
}

// Flies to a new center only when it changes (skips the initial mount)
function RecenterMap({ center }: { center: LatLngExpression }) {
  const map = useMap()
  const isFirst = useRef(true)
  useEffect(() => {
    if (isFirst.current) { isFirst.current = false; return }
    map.flyTo(center, 13, { duration: 0.8 })
  }, [center, map])
  return null
}

function MapClickHandler({
  onAddPlace,
  addMode,
}: {
  onAddPlace?: (lat: number, lng: number) => void
  addMode: boolean
}) {
  useMapEvents({
    click: (e) => {
      if (addMode && onAddPlace) onAddPlace(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export default function MapClient({
  places,
  defaultCity = 'Paris',
  defaultCenter,
  canAdd,
  onAddPlace,
}: MapClientProps) {
  const [activeCategories, setActiveCategories] = useState<Set<string>>(
    new Set(['FOOD', 'ADMIN', 'HEALTH', 'CULTURE', 'COMMUNITY'])
  )
  const [addMode, setAddMode] = useState(false)

  // City search state
  const [searchQuery, setSearchQuery] = useState(defaultCity)
  const [searchResults, setSearchResults] = useState<NominatimResult[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [selectedCityName, setSelectedCityName] = useState(defaultCity)
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    defaultCenter ?? PARIS_CENTER
  )

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const searchCities = useCallback(async (query: string) => {
    setIsSearching(true)
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&featuretype=city`,
        { headers: { 'User-Agent': 'Tsunagari/1.0' } }
      )
      const data: NominatimResult[] = await res.json()
      setSearchResults(data)
      setShowDropdown(data.length > 0)
    } catch {
      setSearchResults([])
      setShowDropdown(false)
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleSearchInput = (value: string) => {
    setSearchQuery(value)
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current)
    if (value.length < 2) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }
    searchTimeoutRef.current = setTimeout(() => searchCities(value), 400)
  }

  const handleSelectCity = (result: NominatimResult) => {
    const cityName = result.name || result.display_name.split(',')[0].trim()
    setMapCenter([parseFloat(result.lat), parseFloat(result.lon)])
    setSelectedCityName(cityName)
    setSearchQuery(result.display_name)
    setShowDropdown(false)
    setSearchResults([])
  }

  const toggleCategory = (cat: string) => {
    setActiveCategories((prev) => {
      const next = new Set(prev)
      if (next.has(cat)) { next.delete(cat) } else { next.add(cat) }
      return next
    })
  }

  // Case-insensitive city match so "paris" matches stored "Paris"
  const filtered = places.filter(
    (p) =>
      activeCategories.has(p.category) &&
      p.city.toLowerCase() === selectedCityName.toLowerCase()
  )

  return (
    <div className="flex flex-col h-full">
      {/* Controls */}
      <div className="flex flex-col gap-2 p-3 border-b border-border bg-background shrink-0">
        {/* City search */}
        <div ref={dropdownRef} className="relative">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
              placeholder="Search city..."
              className="input-field text-xs py-1.5"
              aria-label="Search city"
              autoComplete="off"
            />
            {isSearching && (
              <span className="absolute right-2.5 text-muted text-[10px] pointer-events-none">
                ···
              </span>
            )}
          </div>

          {showDropdown && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-[1001] bg-background border border-border border-t-0 shadow-card">
              {searchResults.map((result) => (
                <button
                  key={result.place_id}
                  onMouseDown={(e) => e.preventDefault()} // keep input focused
                  onClick={() => handleSelectCity(result)}
                  className="w-full text-left px-3 py-2 hover:bg-muted-bg transition-colors duration-150 border-b border-border last:border-0"
                >
                  <div className="text-xs font-bold text-foreground truncate">
                    {result.name || result.display_name.split(',')[0]}
                  </div>
                  <div className="text-[10px] text-muted truncate mt-0.5">
                    {result.display_name}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category filters */}
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
              style={
                activeCategories.has(key)
                  ? { borderColor: CATEGORY_COLORS[key], color: CATEGORY_COLORS[key] }
                  : {}
              }
            >
              {label}
            </button>
          ))}

          {canAdd && (
            <>
              <div className="h-4 w-px bg-border" />
              <button
                onClick={() => setAddMode(!addMode)}
                className={cn(
                  'btn-ghost text-[10px] px-2 py-0.5',
                  addMode && 'bg-foreground text-background border-foreground'
                )}
              >
                {addMode ? 'Cancel' : '+ Add place'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Map — min-h-0 is required so flex-1 can shrink below content height */}
      <div className="flex-1 min-h-0 relative">
        {addMode && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-foreground text-background text-xs px-3 py-1.5 tracking-wide pointer-events-none">
            Click on the map to add a place
          </div>
        )}
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
          className="z-0"
        >
          <InvalidateSizeOnMount />
          <RecenterMap center={mapCenter} />
          <MapClickHandler
            onAddPlace={(lat, lng) => {
              onAddPlace?.(lat, lng)
              setAddMode(false)
            }}
            addMode={addMode}
          />
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filtered.map((place) => {
            const icon = createPinIcon(place.category)
            return (
              <Marker
                key={place.id}
                position={[place.lat, place.lng]}
                icon={icon ?? undefined}
              >
                <Popup>
                  <div className="min-w-[160px]">
                    <div className="font-bold text-foreground text-xs mb-1">
                      {place.name}
                    </div>
                    <div
                      className="text-[10px] uppercase tracking-widest mb-1"
                      style={{ color: CATEGORY_COLORS[place.category] }}
                    >
                      {CATEGORY_LABELS[place.category]}
                    </div>
                    {place.description && (
                      <div className="text-[11px] text-muted leading-relaxed">
                        {place.description}
                      </div>
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

      <div className="px-3 py-1.5 border-t border-border bg-background shrink-0">
        <span className="text-[10px] text-muted">
          {filtered.length} place{filtered.length !== 1 ? 's' : ''} near {selectedCityName}
        </span>
      </div>
    </div>
  )
}
