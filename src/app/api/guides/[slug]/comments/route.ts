import { getServerSession } from 'next-auth/next'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const guide = await prisma.guide.findUnique({ where: { slug: params.slug } })
  if (!guide) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const { content } = await req.json()
  if (!content || typeof content !== 'string' || content.trim().length < 10) {
    return NextResponse.json({ error: 'Comment must be at least 10 characters' }, { status: 400 })
  }

  const comment = await prisma.guideComment.create({
    data: {
      guideId: guide.id,
      authorId: session.user.id,
      content: content.trim(),
    },
    include: {
      author: { select: { name: true, status: true } },
    },
  })

  return NextResponse.json(comment, { status: 201 })
}
