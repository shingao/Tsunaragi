'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const MapClient = dynamic(() => import('@/components/map/MapClient'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-muted-bg">
      <span className="section-label">Loading map...</span>
    </div>
  ),
})

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

interface AddPlaceForm {
  lat: number
  lng: number
  name: string
  category: string
  city: string
  description: string
}

const CATEGORIES = ['FOOD', 'ADMIN', 'HEALTH', 'CULTURE', 'COMMUNITY']

export function MapPageClient({ places: initialPlaces, isAuthenticated }: { places: Place[], isAuthenticated: boolean }) {
  const [places, setPlaces] = useState(initialPlaces)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addForm, setAddForm] = useState<AddPlaceForm | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [formData, setFormData] = useState({ name: '', category: 'FOOD', city: 'Paris', description: '' })

  const handleMapClick = (lat: number, lng: number) => {
    setAddForm({ lat, lng, name: '', category: 'FOOD', city: 'Paris', description: '' })
    setShowAddForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!addForm) return

    setSubmitting(true)
    const res = await fetch('/api/places', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...addForm, ...formData }),
    })

    if (res.ok) {
      const place = await res.json()
      setPlaces((prev) => [...prev, place])
      setShowAddForm(false)
      setAddForm(null)
      setFormData({ name: '', category: 'FOOD', city: 'Paris', description: '' })
    }
    setSubmitting(false)
  }

  return (
    <div className="relative w-full h-full">
      <MapClient
        places={places}
        canAdd={isAuthenticated}
        onAddPlace={handleMapClick}
      />

      {/* Add place modal */}
      {showAddForm && addForm && (
        <div className="absolute inset-0 bg-foreground/20 flex items-center justify-center z-[2000] p-4">
          <div className="bg-background border border-border p-6 w-full max-w-sm">
            <div className="section-label mb-4">Add a place</div>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="section-label block mb-1.5 text-[10px]">Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  required
                  autoFocus
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="section-label block mb-1.5 text-[10px]">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="input-field"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="section-label block mb-1.5 text-[10px]">City *</label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="input-field"
                  >
                    <option>Paris</option>
                    <option>Lyon</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="section-label block mb-1.5 text-[10px]">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field resize-none"
                  rows={2}
                />
              </div>
              <div className="text-[10px] text-muted">
                Coordinates: {addForm.lat.toFixed(4)}, {addForm.lng.toFixed(4)}
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={submitting} className="btn-primary flex-1 justify-center text-xs">
                  {submitting ? 'Adding...' : 'Add place'}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="btn-ghost text-xs">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
