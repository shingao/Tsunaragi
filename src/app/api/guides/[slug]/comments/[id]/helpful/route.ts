import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  _req: Request,
  { params }: { params: { slug: string; id: string } }
) {
  const comment = await prisma.guideComment.findUnique({
    where: { id: params.id },
    include: { guide: { select: { slug: true } } },
  })

  if (!comment || comment.guide.slug !== params.slug) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const updated = await prisma.guideComment.update({
    where: { id: params.id },
    data: { helpful: { increment: 1 } },
  })

  return NextResponse.json({ helpful: updated.helpful })
}
