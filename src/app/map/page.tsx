import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MapPageClient } from './MapPageClient'

export const dynamic = 'force-dynamic'

async function geocodeCity(city: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json&limit=1`,
      {
        headers: { 'User-Agent': 'Tsunagari/1.0' },
        next: { revalidate: 3600 },
      }
    )
    const data = await res.json()
    if (data[0]) return [parseFloat(data[0].lat), parseFloat(data[0].lon)]
  } catch {}
  return null
}

export default async function MapPage() {
  const session = await getServerSession(authOptions)

  const places = await prisma.place.findMany({
    include: { addedBy: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  const serialized = places.map((p) => ({
    id: p.id,
    name: p.name,
    category: p.category,
    lat: p.lat,
    lng: p.lng,
    city: p.city,
    description: p.description,
    addedBy: { name: p.addedBy.name },
  }))

  // Default to Paris
  let defaultCity = 'Paris'
  let defaultCenter: [number, number] = [48.8566, 2.3522]

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { city: true },
    })
    if (user?.city) {
      defaultCity = user.city
      const geocoded = await geocodeCity(user.city)
      if (geocoded) defaultCenter = geocoded
    }
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 3.5rem)' }}>
      <div className="px-4 py-3 border-b border-border flex items-center justify-between shrink-0">
        <span className="section-label">Community Map</span>
        <span className="text-[10px] text-muted">
          {places.length} place{places.length !== 1 ? 's' : ''} contributed
        </span>
      </div>
      <div className="flex-1 min-h-0">
        <MapPageClient
          places={serialized}
          isAuthenticated={!!session}
          defaultCity={defaultCity}
          defaultCenter={defaultCenter}
        />
      </div>
    </div>
  )
}
