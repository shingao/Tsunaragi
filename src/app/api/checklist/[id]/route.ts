import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const item = await prisma.checklistItem.findFirst({
    where: { id: params.id, userId: session.user.id },
  })
  if (!item) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated = await prisma.checklistItem.update({
    where: { id: params.id },
    data: { completed: !item.completed },
  })

  return NextResponse.json(updated)
}
