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
          <div key={category} className="border border-border">
            <button
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted-bg transition-colors duration-150"
              onClick={() => setExpanded(isExpanded ? null : category)}
            >
              <div className="flex items-center gap-3">
                <span className="section-label">{CATEGORY_LABELS[category] ?? category}</span>
                <span className="text-[10px] text-muted">{catCompleted}/{catItems.length}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-16 h-0.5 bg-muted-bg overflow-hidden">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${catItems.length > 0 ? (catCompleted / catItems.length) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-muted text-xs">{isExpanded ? '−' : '+'}</span>
              </div>
            </button>

            {isExpanded && (
              <div className="border-t border-border divide-y divide-border">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150',
                      item.completed ? 'bg-muted-bg/50' : 'hover:bg-muted-bg/30'
                    )}
                    onClick={() => toggle(item)}
                  >
                    <div className={cn(
                      'mt-0.5 w-4 h-4 border flex items-center justify-center shrink-0 transition-all duration-150',
                      item.completed ? 'bg-accent border-accent' : 'border-border',
                      loading === item.id && 'opacity-50'
                    )}>
                      {item.completed && (
                        <svg width="8" height="6" viewBox="0 0 8 6" fill="none">
                          <path d="M1 3L3 5L7 1" stroke="#FBF8F3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className={cn(
                        'text-xs font-bold transition-colors',
                        item.completed ? 'text-muted line-through' : 'text-foreground'
                      )}>
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-muted mt-0.5 leading-relaxed">
                          {item.description}
                        </div>
                      )}
                    </div>
                    {item.guideSlug && (
                      <a
                        href={`/guides/${item.guideSlug}`}
                        onClick={(e) => e.stopPropagation()}
                        title="View step-by-step guide"
                        className="shrink-0 mt-0.5 w-5 h-5 border border-border flex items-center justify-center text-[10px] text-muted hover:border-accent hover:text-accent transition-colors duration-150 font-mono"
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
