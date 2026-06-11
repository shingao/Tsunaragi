'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Divider } from '@/components/Divider'

interface Guide {
  slug: string
  title: string
  summary: string
  checklistCategory: string
  _count: { comments: number }
}

const CATEGORY_LABELS: Record<string, string> = {
  admin: 'Admin & Documents',
  health: 'Health',
  community: 'Community',
  food: 'Food & Markets',
  culture: 'Culture',
}

const CATEGORY_ORDER = ['admin', 'health', 'community', 'food', 'culture']

export function GuidesSearch({ guides }: { guides: Guide[] }) {
  const [query, setQuery] = useState('')

  const filtered = query.trim().length < 2
    ? guides
    : guides.filter((g) =>
        g.title.toLowerCase().includes(query.toLowerCase()) ||
        g.summary.toLowerCase().includes(query.toLowerCase())
      )

  const grouped = CATEGORY_ORDER.reduce<Record<string, Guide[]>>((acc, cat) => {
    const catGuides = filtered.filter((g) => g.checklistCategory === cat)
    if (catGuides.length > 0) acc[cat] = catGuides
    return acc
  }, {})

  return (
    <div>
      <div className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search guides..."
          className="input-field max-w-sm"
          aria-label="Search guides"
        />
      </div>

      {Object.keys(grouped).length === 0 ? (
        <p className="text-base" style={{ color: 'var(--muted)' }}>No guides match your search.</p>
      ) : (
        <div className="space-y-10">
          {Object.entries(grouped).map(([cat, catGuides]) => (
            <div key={cat}>
              <Divider label={CATEGORY_LABELS[cat] ?? cat} className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {catGuides.map((guide) => (
                  <Link key={guide.slug} href={`/guides/${guide.slug}`} className="block group">
                    <div
                      className="p-5 h-full transition-colors duration-150"
                      style={{
                        border: '1px solid var(--line)',
                        backgroundColor: 'var(--surface)',
                        borderRadius: '4px',
                      }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)')}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.borderColor = 'var(--line)')}
                    >
                      <div
                        className="text-base font-medium mb-2 transition-colors group-hover:text-accent"
                        style={{ color: 'var(--text)' }}
                      >
                        {guide.title}
                      </div>
                      <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--muted)' }}>
                        {guide.summary}
                      </p>
                      <div
                        className="text-[10px] uppercase tracking-widest"
                        style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                      >
                        {guide._count.comments} comment{guide._count.comments !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
