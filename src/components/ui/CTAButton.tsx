import { cn } from '@/lib/utils'

interface CTAButtonProps {
  variant?: 'primary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  children: React.ReactNode
  className?: string
  target?: string
  rel?: string
}

const base = 'inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50'

const variants = {
  primary: 'bg-accent-cyan text-bg-base hover:bg-accent-cyan-dim shadow-glow-cyan hover:shadow-none px-6 py-3 text-sm',
  outline: 'border border-accent-cyan/40 text-accent-cyan hover:bg-accent-cyan/10 hover:border-accent-cyan px-6 py-3 text-sm',
  ghost:   'text-text-secondary hover:text-text-primary px-4 py-2 text-sm',
}

const sizes = {
  sm: 'px-4 py-2 text-xs',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
}

export function CTAButton({ variant = 'primary', size, href, onClick, children, className, target, rel }: CTAButtonProps) {
  const cls = cn(base, variants[variant], size && sizes[size], className)

  if (href) {
    return <a href={href} target={target} rel={rel} className={cls}>{children}</a>
  }
  return <button onClick={onClick} className={cls}>{children}</button>
}
