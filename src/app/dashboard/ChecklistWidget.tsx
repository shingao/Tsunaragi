'use client'

import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface ChecklistItem {
  id: string
  category: string
  title: string
  description: string | null
  completed: boolean
  order: number
  guideSlug: string | null
}

const CATEGORY_LABELS: Record<string, string> = {
  admin: 'Admin',
  health: 'Health',
  food: 'Food & Markets',
  community: 'Community',
  culture: 'Culture',
}

const CATEGORY_ORDER = ['admin', 'health', 'community', 'food', 'culture']

interface ChecklistWidgetProps {
  items: ChecklistItem[]
  categoryGroups: Record<string, ChecklistItem[]>
}

export function ChecklistWidget({ items: initialItems }: ChecklistWidgetProps) {
  const [items, setItems] = useState(initialItems)
  const [loading, setLoading] = useState<string | null>(null)
  const [expanded, setExpanded] = useState<string | null>('admin')

  const categoryGroups = items.reduce<Record<string, ChecklistItem[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const toggle = useCallback(async (item: ChecklistItem) => {
    setLoading(item.id)
    const res = await fetch(`/api/checklist/${item.id}`, { method: 'PATCH' })
    if (res.ok) {
      const updated = await res.json()
      setItems((prev) => prev.map((i) => (i.id === updated.id ? { ...updated, guideSlug: item.guideSlug } : i)))
    }
    setLoading(null)
  }, [])

  const sortedCategories = CATEGORY_ORDER.filter((cat) => categoryGroups[cat])

  return (
    <div className="space-y-2">
      {sortedCategories.map((category) => {
        const catItems = categoryGroups[category] ?? []
        const catCompleted = catItems.filter((i) => i.completed).length
        const isExpanded = expanded === category

        return (
          <div
            key={category}
            style={{ border: '1px solid var(--line)', borderRadius: '4px', overflow: 'hidden' }}
          >
            <button
              className="w-full flex items-center justify-between px-4 py-3 transition-colors duration-150"
              style={{ backgroundColor: isExpanded ? 'var(--surface-alt)' : 'var(--surface)' }}
              onClick={() => setExpanded(isExpanded ? null : category)}
            >
              <div className="flex items-center gap-3">
                <span className="section-label">{CATEGORY_LABELS[category] ?? category}</span>
                <span
                  className="text-[10px]"
                  style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
                >
                  {catCompleted}/{catItems.length}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-16 h-1 overflow-hidden"
                  style={{ backgroundColor: 'var(--line)', borderRadius: '2px' }}
                >
                  <div
                    className="h-full transition-all duration-300"
                    style={{
                      width: `${catItems.length > 0 ? (catCompleted / catItems.length) * 100 : 0}%`,
                      backgroundColor: catCompleted === catItems.length ? 'var(--success)' : 'var(--accent)',
                    }}
                  />
                </div>
                <span className="text-xs" style={{ color: 'var(--muted)' }}>{isExpanded ? '−' : '+'}</span>
              </div>
            </button>

            {isExpanded && (
              <div style={{ borderTop: '1px solid var(--line)' }}>
                {catItems.map((item, idx) => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150',
                    )}
                    style={{
                      backgroundColor: item.completed ? 'var(--success-soft)' : undefined,
                      borderTop: idx > 0 ? '1px solid var(--line)' : undefined,
                      opacity: loading === item.id ? 0.5 : 1,
                    }}
                    onClick={() => toggle(item)}
                  >
                    {/* Custom checkbox */}
                    <div
                      className="mt-0.5 w-4 h-4 flex items-center justify-center shrink-0 transition-all duration-150"
                      style={{
                        border: '1px solid',
                        borderColor: item.completed ? 'var(--success)' : 'var(--line)',
                        backgroundColor: item.completed ? 'var(--success)' : 'var(--surface)',
                        borderRadius: '3px',
                      }}
                    >
                      {item.completed && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div
                        className="text-base font-medium transition-colors"
                        style={{
                          color: item.completed ? 'var(--muted)' : 'var(--text)',
                          textDecoration: item.completed ? 'line-through' : 'none',
                        }}
                      >
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="text-sm mt-0.5 leading-relaxed" style={{ color: 'var(--muted)' }}>
                          {item.description}
                        </div>
                      )}
                    </div>

                    {item.guideSlug && (
                      <a
                        href={`/guides/${item.guideSlug}`}
                        onClick={(e) => e.stopPropagation()}
                        title="View step-by-step guide"
                        className="shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center text-[10px] transition-colors duration-150"
                        style={{
                          border: '1px solid var(--line)',
                          color: 'var(--muted)',
                          borderRadius: '3px',
                          fontFamily: 'var(--font-jetbrains), monospace',
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
                          ;(e.currentTarget as HTMLElement).style.color = 'var(--accent)'
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'
                          ;(e.currentTarget as HTMLElement).style.color = 'var(--muted)'
                        }}
                      >
                        ?
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
