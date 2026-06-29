import { cn } from '@/lib/utils'

interface TechChipProps {
  label: string
  className?: string
}

export function TechChip({ label, className }: TechChipProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-mono font-medium',
        'border border-accent-cyan/25 text-accent-cyan bg-accent-cyan-glow',
        'transition-all duration-200 hover:border-accent-cyan/50 hover:bg-accent-cyan/10',
        className
      )}
    >
      {label}
    </span>
  )
}
