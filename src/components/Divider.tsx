import { cn } from '@/lib/utils'

interface DividerProps {
  label?: string
  className?: string
  rhythm?: boolean
}

export function Divider({ label, className, rhythm }: DividerProps) {
  if (rhythm) {
    return (
      <div className={cn('flex items-center gap-3 text-muted select-none', className)}>
        <span className="text-xs tracking-widest">— — —</span>
      </div>
    )
  }

  if (label) {
    return (
      <div className={cn('flex items-center gap-4', className)}>
        <div className="flex-1 border-t border-border" />
        <span className="section-label">{label}</span>
        <div className="flex-1 border-t border-border" />
      </div>
    )
  }

  return <hr className={cn('border-t border-border', className)} />
}
