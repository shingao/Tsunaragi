'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CommentForm({ slug }: { slug: string }) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (content.trim().length < 10) {
      setError('Please write at least 10 characters.')
      return
    }
    setSubmitting(true)
    setError('')

    const res = await fetch(`/api/guides/${slug}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    })

    if (res.ok) {
      setContent('')
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Something went wrong.')
    }
    setSubmitting(false)
  }

  const charCount = content.trim().length
  const isReady = charCount >= 10

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your experience with this process..."
        className="input-field resize-none text-sm leading-relaxed"
        rows={4}
        required
      />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting || !isReady}
            className="btn-primary text-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? 'Posting...' : 'Post comment'}
          </button>
          {success && (
            <span
              className="text-xs"
              style={{ color: 'var(--success)', fontFamily: 'var(--font-jetbrains), monospace' }}
            >
              ✓ Posted
            </span>
          )}
        </div>
        <span
          className="text-[10px]"
          style={{
            color: isReady ? 'var(--success)' : 'var(--muted)',
            fontFamily: 'var(--font-jetbrains), monospace',
            transition: 'color 200ms',
          }}
        >
          {charCount} chars
        </span>
      </div>

      {error && (
        <p className="text-xs" style={{ color: '#c0392b' }}>{error}</p>
      )}
    </form>
  )
}
