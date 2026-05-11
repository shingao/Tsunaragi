import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')

  const experiences = await prisma.experience.findMany({
    where: {
      ...(city ? { city } : {}),
      date: { gte: new Date() },
    },
    include: {
      host: { select: { id: true, name: true, status: true } },
      attendees: { select: { userId: true } },
    },
    orderBy: { date: 'asc' },
  })

  return NextResponse.json(experiences)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, description, city, date, capacity } = body

  if (!title || !description || !city || !date || !capacity) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const experience = await prisma.experience.create({
    data: {
      hostId: session.user.id,
      title,
      description,
      city,
      date: new Date(date),
      capacity: parseInt(capacity),
    },
    include: {
      host: { select: { id: true, name: true, status: true } },
      attendees: { select: { userId: true } },
    },
  })

  return NextResponse.json(experience, { status: 201 })
}
