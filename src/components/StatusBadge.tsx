import { cn } from '@/lib/utils'
import type { UserStatus } from '@/lib/status'

interface StatusBadgeProps {
  status: UserStatus | string
  className?: string
}

const STATUS_CONFIG = {
  NEWCOMER: { dot: 'bg-amber-500', text: 'text-amber-700', label: 'NEWCOMER' },
  SETTLED: { dot: 'bg-emerald-500', text: 'text-emerald-700', label: 'SETTLED' },
  AMBASSADOR: { dot: 'bg-accent', text: 'text-accent', label: 'AMBASSADOR' },
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status as UserStatus] ?? STATUS_CONFIG.NEWCOMER

  return (
    <span className={cn('inline-flex items-center gap-1.5', className)}>
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      <span className={cn('text-[10px] font-bold uppercase tracking-widest', config.text)}>
        {config.label}
      </span>
    </span>
  )
}
