import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { MapPageClient } from './MapPageClient'

export const dynamic = 'force-dynamic'

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

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 3.5rem)' }}>
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div>
          <span className="section-label">Community Map</span>
        </div>
        <span className="text-[10px] text-muted">{places.length} place{places.length !== 1 ? 's' : ''} contributed</span>
      </div>
      <div className="flex-1 overflow-hidden">
        <MapPageClient places={serialized} isAuthenticated={!!session} />
      </div>
    </div>
  )
}
