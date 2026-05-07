'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function CommentForm({ slug }: { slug: string }) {
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
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
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error ?? 'Something went wrong.')
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Share your experience with this process..."
        className="input-field resize-none text-sm"
        rows={4}
        required
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={submitting || content.trim().length < 10}
        className="btn-primary text-xs"
      >
        {submitting ? 'Posting...' : 'Post comment'}
      </button>
    </form>
  )
}
