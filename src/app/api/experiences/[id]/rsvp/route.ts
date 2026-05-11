import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const experience = await prisma.experience.findUnique({
    where: { id: params.id },
    include: { attendees: true },
  })

  if (!experience) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const existing = await prisma.experienceAttendee.findUnique({
    where: { experienceId_userId: { experienceId: params.id, userId: session.user.id } },
  })

  if (existing) {
    await prisma.experienceAttendee.delete({ where: { id: existing.id } })
    return NextResponse.json({ attending: false })
  }

  if (experience.attendees.length >= experience.capacity) {
    return NextResponse.json({ error: 'Experience is full' }, { status: 400 })
  }

  await prisma.experienceAttendee.create({
    data: { experienceId: params.id, userId: session.user.id },
  })

  return NextResponse.json({ attending: true })
}
