import { cn } from '@/lib/utils'

interface GlassCardProps {
  variant?: 'default' | 'active' | 'featured'
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function GlassCard({ variant = 'default', children, className, onClick }: GlassCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-2xl p-6 transition-all duration-300',
        variant === 'default' && 'hover:border-white/15 hover:bg-bg-surface/80',
        variant === 'active' && 'border border-accent-cyan/30 shadow-glow-cyan',
        variant === 'featured' && 'border border-accent-cyan/20 shadow-card-hover bg-gradient-to-br from-accent-cyan-glow to-accent-purple-glow',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
