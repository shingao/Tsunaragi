import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { refreshUserStatus } from '@/lib/status'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const [asNewcomer, asAmbassador] = await Promise.all([
    prisma.buddyMatch.findMany({
      where: { newcomerId: session.user.id },
      include: { ambassador: { select: { id: true, name: true, nationality: true, city: true, status: true, bio: true } } },
    }),
    prisma.buddyMatch.findMany({
      where: { ambassadorId: session.user.id },
      include: { newcomer: { select: { id: true, name: true, nationality: true, city: true, status: true } } },
    }),
  ])

  return NextResponse.json({ asNewcomer, asAmbassador })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { action, ambassadorId, matchId, status } = body

  if (action === 'request') {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { nationality: true, city: true, status: true },
    })
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const existing = await prisma.buddyMatch.findFirst({
      where: { newcomerId: session.user.id, status: { in: ['PENDING', 'ACTIVE'] } },
    })
    if (existing) {
      return NextResponse.json({ error: 'Already have an active buddy request' }, { status: 400 })
    }

    let targetAmbassador = ambassadorId
    if (!targetAmbassador) {
      const ambassador = await prisma.user.findFirst({
        where: {
          status: 'AMBASSADOR',
          nationality: user.nationality ?? undefined,
          city: user.city ?? undefined,
          NOT: { id: session.user.id },
        },
      })
      if (!ambassador) {
        return NextResponse.json({ error: 'No matching ambassador found' }, { status: 404 })
      }
      targetAmbassador = ambassador.id
    }

    const match = await prisma.buddyMatch.create({
      data: { newcomerId: session.user.id, ambassadorId: targetAmbassador },
      include: { ambassador: { select: { id: true, name: true, nationality: true, city: true, status: true } } },
    })

    return NextResponse.json(match, { status: 201 })
  }

  if (action === 'update' && matchId) {
    const match = await prisma.buddyMatch.findFirst({
      where: { id: matchId, ambassadorId: session.user.id },
    })
    if (!match) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const updated = await prisma.buddyMatch.update({
      where: { id: matchId },
      data: { status },
    })

    if (status === 'ACTIVE') {
      await refreshUserStatus(session.user.id)
    }

    return NextResponse.json(updated)
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
