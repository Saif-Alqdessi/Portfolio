'use client'

import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SelectChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
  className?: string
}

/**
 * Toggleable pill. Unselected styling matches TechChip so chips read
 * consistently across the site; selected state uses the primary button
 * tokens (accent-cyan fill, glow) for a clear "active" affordance.
 */
export function SelectChip({ label, selected = false, onClick, className }: SelectChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        'inline-flex min-h-[2.75rem] items-center gap-1.5 rounded-full border px-4 text-xs font-mono font-medium transition-all duration-200 sm:min-h-[2rem] sm:px-3',
        selected
          ? 'border-accent-cyan bg-accent-cyan text-bg-base shadow-glow-cyan'
          : 'border-accent-cyan/25 text-accent-cyan bg-accent-cyan-glow hover:border-accent-cyan/50 hover:bg-accent-cyan/10',
        className
      )}
    >
      {selected && <Check size={12} strokeWidth={2.5} />}
      {label}
    </button>
  )
}
