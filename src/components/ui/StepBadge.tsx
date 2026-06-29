import { cn } from '@/lib/utils'

interface StepBadgeProps {
  step: number
  active?: boolean
  className?: string
}

export function StepBadge({ step, active = false, className }: StepBadgeProps) {
  const label = String(step).padStart(2, '0')
  return (
    <div
      className={cn(
        'w-10 h-10 rounded-full flex items-center justify-center text-sm font-mono font-bold border transition-all duration-300',
        active
          ? 'bg-accent-cyan text-bg-base border-accent-cyan shadow-glow-cyan'
          : 'bg-bg-surface text-text-muted border-accent-cyan/30 hover:border-accent-cyan/60 hover:text-text-secondary',
        className
      )}
    >
      {label}
    </div>
  )
}
