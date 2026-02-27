import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  label?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
}

export function SectionHeader({ label, title, subtitle, align = 'center', className }: SectionHeaderProps) {
  return (
    <div className={cn('space-y-3', align === 'center' ? 'text-center' : 'text-left', className)}>
      {label && (
        <span className="inline-block text-xs font-mono font-semibold tracking-[0.2em] uppercase text-accent-cyan">
          {label}
        </span>
      )}
      <h2 className="text-section font-bold text-text-primary">{title}</h2>
      {subtitle && (
        <p className="text-text-secondary text-lg max-w-2xl leading-relaxed mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  )
}
