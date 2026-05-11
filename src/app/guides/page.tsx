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
        <h1 className="text-2xl font-serif" style={{ color: 'var(--text)', fontWeight: 500 }}>Guides</h1>
        <p className="text-sm mt-2 max-w-xl leading-relaxed" style={{ color: 'var(--muted)' }}>
          Step-by-step guides for each item on your first-steps checklist. Official links,
          plain-language instructions, and community tips from people who have done it.
        </p>
      </div>

      <Divider className="mb-8" />

      <GuidesSearch guides={guides} />

      <div className="mt-12 pt-8" style={{ borderTop: '1px solid var(--line)' }}>
        <p className="text-xs" style={{ color: 'var(--muted)' }}>
          Have a tip to share?{' '}
          <Link
            href="/dashboard"
            className="underline transition-colors"
            style={{ color: 'var(--text)' }}
          >
            Open your checklist
          </Link>{' '}
          and click the{' '}
          <span style={{ fontFamily: 'var(--font-jetbrains), monospace' }}>?</span>{' '}
          icon next to any item.
        </p>
      </div>
    </div>
  )
}
