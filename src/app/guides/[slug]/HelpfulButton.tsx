'use client'

import { useState } from 'react'

export function HelpfulButton({
  commentId,
  slug,
  initialCount,
}: {
  commentId: string
  slug: string
  initialCount: number
}) {
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    if (voted || loading) return
    setLoading(true)
    const res = await fetch(`/api/guides/${slug}/comments/${commentId}/helpful`, {
      method: 'POST',
    })
    if (res.ok) {
      const data = await res.json()
      setCount(data.helpful)
      setVoted(true)
    }
    setLoading(false)
  }

  return (
    <button
      onClick={handleClick}
      disabled={voted || loading}
      className={`inline-flex items-center gap-1 text-[10px] font-mono transition-colors duration-150 ${
        voted ? 'text-accent' : 'text-muted hover:text-foreground'
      }`}
      title={voted ? 'Marked as helpful' : 'Mark as helpful'}
    >
      <span>↑</span>
      <span>{count}</span>
    </button>
  )
}
