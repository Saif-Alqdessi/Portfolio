import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  icon: LucideIcon
  number: React.ReactNode
  title: string
  description: string
  className?: string
}

export function StatCard({ icon: Icon, number, title, description, className }: StatCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center text-center rounded-2xl border border-foreground/5 bg-bg-surface/80 backdrop-blur-sm p-8 transition-colors hover:bg-bg-elevated',
        className
      )}
    >
      <div className="mb-6 rounded-xl bg-accent-purple/10 p-3 text-accent-purple">
        <Icon size={24} strokeWidth={1.5} />
      </div>
      <h3 className="mb-2 text-4xl sm:text-5xl font-bold font-mono tabular-nums text-accent-purple">
        {number}
      </h3>
      <p className="mb-2 text-lg font-bold text-text-primary">{title}</p>
      <p className="text-sm text-text-muted">{description}</p>
    </div>
  )
}
