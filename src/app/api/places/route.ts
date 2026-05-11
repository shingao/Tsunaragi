import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { refreshUserStatus } from '@/lib/status'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')
  const category = searchParams.get('category')

  const places = await prisma.place.findMany({
    where: {
      ...(city ? { city } : {}),
      ...(category ? { category } : {}),
    },
    include: { addedBy: { select: { name: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(places)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, category, lat, lng, city, description } = body

  if (!name || !category || lat == null || lng == null || !city) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const place = await prisma.place.create({
    data: {
      name,
      category: category.toUpperCase(),
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      city,
      description: description || null,
      addedById: session.user.id,
    },
    include: { addedBy: { select: { name: true } } },
  })

  await refreshUserStatus(session.user.id)

  return NextResponse.json(place, { status: 201 })
}
