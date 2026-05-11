'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Divider } from '@/components/Divider'

export default function CreateStoryPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [form, setForm] = useState({ title: '', content: '', tagsInput: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (status === 'loading') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <span className="section-label">Loading...</span>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10 text-center">
        <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
          You must be signed in to write a story.
        </p>
        <Link href="/auth/signin" className="btn-primary text-sm">Sign in</Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) return

    setLoading(true)
    setError('')

    const tags = form.tagsInput
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)

    const res = await fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: form.title, content: form.content, tags }),
    })

    if (res.ok) {
      const story = await res.json()
      router.push(`/stories/${story.id}`)
    } else {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong')
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-6">
        <Link
          href="/stories"
          className="text-xs transition-colors"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-jetbrains), monospace' }}
        >
          ← Stories
        </Link>
      </div>

      <div className="mb-8">
        <div className="section-label mb-1">Share</div>
        <h1 className="text-2xl font-serif" style={{ color: 'var(--text)', fontWeight: 500 }}>
          Write your story
        </h1>
        <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--muted)' }}>
          Share your arrival experience to help others on the same journey.
        </p>
      </div>

      <Divider className="mb-8" />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="section-label block mb-2">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="My first month in Paris..."
            className="input-field text-base"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="section-label block mb-2">Your story *</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            placeholder="Tell your story. What surprised you? What was harder than expected? What helped you most?"
            className="input-field resize-none leading-relaxed"
            rows={16}
            required
          />
        </div>

        <div>
          <label className="section-label block mb-2">Tags</label>
          <input
            type="text"
            value={form.tagsInput}
            onChange={(e) => setForm({ ...form, tagsInput: e.target.value })}
            placeholder="housing, admin, community (comma-separated)"
            className="input-field"
          />
          <p className="text-[10px] mt-1.5" style={{ color: 'var(--muted)' }}>
            Separate tags with commas.
          </p>
        </div>

        {error && (
          <p className="text-xs" style={{ color: '#c0392b' }}>{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || !form.title.trim() || !form.content.trim()}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Publishing...' : 'Publish story'}
          </button>
          <Link href="/stories" className="btn-ghost">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
