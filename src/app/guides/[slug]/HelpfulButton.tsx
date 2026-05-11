'use client'

import { useState, useEffect } from 'react'

export function HelpfulButton({
  commentId,
  slug,
  initialCount,
}: {
  commentId: string
  slug: string
  initialCount: number
}) {
  const storageKey = `helpful-${commentId}`
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [animate, setAnimate] = useState(false)

  // Persist voted state in localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setVoted(localStorage.getItem(storageKey) === '1')
    }
  }, [storageKey])

  const handleClick = async () => {
    if (voted || loading) return

    // Optimistic update + animation
    setCount((c) => c + 1)
    setVoted(true)
    setAnimate(true)
    if (typeof window !== 'undefined') localStorage.setItem(storageKey, '1')
    setTimeout(() => setAnimate(false), 600)

    setLoading(true)
    try {
      const res = await fetch(`/api/guides/${slug}/comments/${commentId}/helpful`, {
        method: 'POST',
      })
      if (res.ok) {
        const data = await res.json()
        setCount(data.helpful)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @keyframes helpfulPop {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        @keyframes countBounce {
          0%   { transform: translateY(0); opacity: 1; }
          30%  { transform: translateY(-4px); opacity: 0.8; }
          60%  { transform: translateY(1px); }
          100% { transform: translateY(0); opacity: 1; }
        }
        .helpful-icon-anim { animation: helpfulPop 0.55s cubic-bezier(.36,.07,.19,.97) both; }
        .helpful-count-anim { animation: countBounce 0.45s ease both; }
      `}</style>

      <button
        onClick={handleClick}
        disabled={voted || loading}
        title={voted ? 'Marked as helpful' : 'Mark as helpful'}
        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded transition-all duration-150 select-none group"
        style={{
          cursor: voted ? 'default' : 'pointer',
          border: voted ? '1px solid var(--accent-soft)' : '1px solid transparent',
          backgroundColor: voted ? 'var(--accent-soft)' : 'transparent',
        }}
        onMouseEnter={(e) => {
          if (!voted) (e.currentTarget as HTMLElement).style.borderColor = 'var(--line)'
        }}
        onMouseLeave={(e) => {
          if (!voted) (e.currentTarget as HTMLElement).style.borderColor = 'transparent'
        }}
      >
        {/* Thumbs up SVG */}
        <span
          className={animate ? 'helpful-icon-anim' : ''}
          style={{
            display: 'inline-flex',
            color: voted ? 'var(--accent)' : 'var(--muted)',
            transition: 'color 200ms',
          }}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 16 16"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6.956 1.745C7.021.81 7.908.087 8.839.325l.996.27a1.875 1.875 0 0 1 1.306 1.615l.047.857c.078 1.421-.704 2.527-1.594 3.386a.75.75 0 0 0-.034.024l-.009.007-.003.003-.001.001h-.001L8 7.5l1.547-1.01.001-.001.002-.002.01-.007a6.307 6.307 0 0 0 .145-.118c.1-.085.235-.205.37-.357.26-.29.5-.662.603-1.103L8.184 4.5a.75.75 0 0 0-.23-.5 3.375 3.375 0 0 0-.998.745zM7 9.75v4.5H3.75A2.25 2.25 0 0 1 1.5 12V9.75H7zm1.5 0v4.5h3.75A2.25 2.25 0 0 0 14.5 12V9.75H8.5z" />
          </svg>
        </span>

        {/* Count */}
        <span
          key={count}
          className={animate ? 'helpful-count-anim' : ''}
          style={{
            fontSize: '10px',
            fontFamily: 'var(--font-jetbrains), monospace',
            color: voted ? 'var(--accent)' : 'var(--muted)',
            transition: 'color 200ms',
            minWidth: '12px',
            display: 'inline-block',
            textAlign: 'center',
          }}
        >
          {count}
        </span>
      </button>
    </>
  )
}
