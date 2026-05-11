import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { refreshUserStatus } from '@/lib/status'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const tag = searchParams.get('tag')

  const stories = await prisma.story.findMany({
    include: {
      author: { select: { id: true, name: true, nationality: true, status: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const filtered = tag
    ? stories.filter((s) => {
        try {
          return (JSON.parse(s.tags) as string[]).includes(tag)
        } catch {
          return false
        }
      })
    : stories

  return NextResponse.json(filtered)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { title, content, tags } = body

  if (!title || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const story = await prisma.story.create({
    data: {
      authorId: session.user.id,
      title,
      content,
      tags: JSON.stringify(Array.isArray(tags) ? tags : []),
    },
    include: { author: { select: { id: true, name: true, nationality: true, status: true } } },
  })

  await refreshUserStatus(session.user.id)

  return NextResponse.json(story, { status: 201 })
}
