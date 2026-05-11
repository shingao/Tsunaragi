'use client'

import { cn } from '@/lib/utils'
import type { UserStatus } from '@/lib/status'
import { useState } from 'react'

interface StatusBadgeProps {
  status: UserStatus | string
  className?: string
  showTooltip?: boolean
}

const STATUS_CONFIG: Record<string, {
  dotColor: string
  textColor: string
  label: string
  tooltip: string
}> = {
  NEWCOMER: {
    dotColor: 'var(--muted)',
    textColor: 'var(--muted)',
    label: 'Newcomer',
    tooltip: 'Just arrived — settling into France',
  },
  SETTLED: {
    dotColor: 'var(--success)',
    textColor: 'var(--text)',
    label: 'Settling in',
    tooltip: '3+ months in France — finding your rhythm',
  },
  AMBASSADOR: {
    dotColor: 'var(--accent)',
    textColor: 'var(--accent)',
    label: 'Ambassador',
    tooltip: 'Active contributor — welcoming newcomers',
  },
}

export function StatusBadge({ status, className, showTooltip = false }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as UserStatus] ?? STATUS_CONFIG.NEWCOMER
  const [visible, setVisible] = useState(false)

  return (
    <span
      className={cn('inline-flex items-center gap-1.5 relative', className)}
      onMouseEnter={() => showTooltip && setVisible(true)}
      onMouseLeave={() => showTooltip && setVisible(false)}
    >
      {/* Dot with subtle pulse for Ambassador */}
      <span
        className={cn(
          'w-1.5 h-1.5 rounded-full shrink-0',
          status === 'AMBASSADOR' && 'animate-pulse'
        )}
        style={{ backgroundColor: config.dotColor }}
      />
      <span
        className="text-[11px] font-medium"
        style={{
          fontFamily: 'var(--font-jetbrains), monospace',
          color: config.textColor,
          fontWeight: status === 'AMBASSADOR' ? 600 : 400,
        }}
      >
        {config.label}
      </span>

      {/* Tooltip */}
      {showTooltip && visible && (
        <span
          className="absolute bottom-full left-0 mb-1.5 whitespace-nowrap text-[11px] px-2 py-1 rounded pointer-events-none z-10"
          style={{
            backgroundColor: 'var(--text)',
            color: 'var(--bg)',
            fontFamily: 'var(--font-inter), sans-serif',
          }}
        >
          {config.tooltip}
        </span>
      )}
    </span>
  )
}
