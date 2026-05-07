import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateChecklist } from '@/lib/checklist'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { name, nationality, city, arrivalDate, languages } = body

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: name || null,
      nationality: nationality || null,
      city: city || null,
      arrivalDate: arrivalDate ? new Date(arrivalDate) : null,
      languages: JSON.stringify(Array.isArray(languages) ? languages : []),
    },
  })

  await generateChecklist(user.id, user.nationality, user.city)

  return NextResponse.json({ success: true })
}
