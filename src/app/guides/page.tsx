import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Divider } from '@/components/Divider'
import { GuidesSearch } from './GuidesSearch'

export const dynamic = 'force-dynamic'

export default async function GuidesPage() {
  const guides = await prisma.guide.findMany({
    orderBy: { checklistCategory: 'asc' },
    select: {
      slug: true,
      title: true,
      summary: true,
      checklistCategory: true,
      _count: { select: { comments: true } },
    },
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="mb-8">
        <div className="section-label mb-1">Knowledge base</div>
        <h1 className="text-2xl font-bold tracking-tight">Guides</h1>
        <p className="text-sm text-muted mt-2 max-w-xl">
          Step-by-step guides for each item on your arrival checklist. Official links,
          plain-language instructions, and community tips from people who have done it.
        </p>
      </div>

      <Divider className="mb-8" />

      <GuidesSearch guides={guides} />

      <div className="mt-12 border-t border-border pt-8">
        <p className="text-xs text-muted">
          Have a tip to share?{' '}
          <Link href="/dashboard" className="text-foreground hover:text-accent transition-colors underline">
            Open your checklist
          </Link>{' '}
          and click the <span className="font-mono">?</span> icon next to any item.
        </p>
      </div>
    </div>
  )
}
