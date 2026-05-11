'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface BuddyActionsProps {
  action: 'request' | 'request-specific' | 'accept' | 'decline'
  label: string
  ambassadorId?: string
  matchId?: string
}

export function BuddyActions({ action, label, ambassadorId, matchId }: BuddyActionsProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handle = async () => {
    setLoading(true)
    setError('')

    let body: Record<string, string> = {}

    if (action === 'request') {
      body = { action: 'request' }
    } else if (action === 'request-specific' && ambassadorId) {
      body = { action: 'request', ambassadorId }
    } else if (action === 'accept' && matchId) {
      body = { action: 'update', matchId, status: 'ACTIVE' }
    } else if (action === 'decline' && matchId) {
      body = { action: 'update', matchId, status: 'CLOSED' }
    }

    const res = await fetch('/api/buddy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Something went wrong')
    } else {
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div>
      <button
        onClick={handle}
        disabled={loading}
        className={cn(
          'text-xs',
          action === 'accept' ? 'btn-primary' :
          action === 'decline' ? 'btn-ghost' :
          'btn-secondary',
          loading && 'opacity-50'
        )}
      >
        {loading ? '...' : label}
      </button>
      {error && <p className="text-[10px] text-red-600 mt-1">{error}</p>}
    </div>
  )
}
