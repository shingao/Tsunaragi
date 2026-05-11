import { cn } from '@/lib/utils'

interface DividerProps {
  label?: string
  className?: string
  rhythm?: boolean
}

export function Divider({ label, className, rhythm }: DividerProps) {
  if (rhythm) {
    // Subtle mycelium-inspired dotted line instead of "— — —"
    return (
      <div className={cn('flex items-center gap-2 select-none', className)} aria-hidden>
        <div
          className="flex-1 h-px"
          style={{
            background: 'repeating-linear-gradient(90deg, var(--line) 0px, var(--line) 4px, transparent 4px, transparent 10px)',
          }}
        />
      </div>
    )
  }

  if (label) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--line)' }} />
        <span className="section-label">{label}</span>
        <div className="flex-1 h-px" style={{ backgroundColor: 'var(--line)' }} />
      </div>
    )
  }

  return (
    <hr
      className={cn(className)}
      style={{ borderTop: '1px solid var(--line)', borderBottom: 'none', borderLeft: 'none', borderRight: 'none' }}
    />
  )
}
