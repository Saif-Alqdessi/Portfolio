import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NeonIconProps {
  icon: LucideIcon
  size?: 'sm' | 'md'
  color?: 'cyan' | 'purple'
  className?: string
}

export function NeonIcon({ icon: Icon, size = 'md', color = 'cyan', className }: NeonIconProps) {
  const px = size === 'sm' ? 16 : 20
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-xl border border-white/10 transition-all duration-300',
        size === 'sm' ? 'w-8 h-8' : 'w-10 h-10',
        color === 'cyan'
          ? 'text-accent-cyan bg-accent-cyan-glow hover:shadow-glow-cyan'
          : 'text-accent-purple bg-accent-purple-glow hover:shadow-glow-purple',
        className
      )}
    >
      <Icon size={px} strokeWidth={1.5} />
    </div>
  )
}
