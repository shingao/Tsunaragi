'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface RSVPButtonProps {
  experienceId: string
  isAttending: boolean
  isFull: boolean
}

export function RSVPButton({ experienceId, isAttending: initial, isFull }: RSVPButtonProps) {
  const [isAttending, setIsAttending] = useState(initial)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleRSVP = async () => {
    setLoading(true)
    const res = await fetch(`/api/experiences/${experienceId}/rsvp`, { method: 'POST' })
    if (res.ok) {
      const data = await res.json()
      setIsAttending(data.attending)
      router.refresh()
    }
    setLoading(false)
  }

  if (isFull && !isAttending) {
    return (
      <button disabled className="btn-ghost w-full justify-center text-xs opacity-50 cursor-not-allowed">
        Experience is full
      </button>
    )
  }

  return (
    <button
      onClick={handleRSVP}
      disabled={loading}
      className={cn(
        'w-full justify-center text-xs',
        isAttending ? 'btn-ghost' : 'btn-primary',
        loading && 'opacity-50'
      )}
    >
      {loading ? '...' : isAttending ? 'Cancel RSVP' : 'RSVP — Join this experience'}
    </button>
  )
}
