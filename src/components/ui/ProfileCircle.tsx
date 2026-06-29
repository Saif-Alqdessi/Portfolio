import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ProfileCircleProps {
  src: string
  alt: string
  size?: number
  className?: string
}

export function ProfileCircle({ src, alt, size = 200, className }: ProfileCircleProps) {
  const outer = size + 32
  return (
    <div className={cn('relative flex-shrink-0', className)} style={{ width: outer, height: outer }}>
      {/* Ambient glow */}
      <div className="absolute inset-0 rounded-full bg-accent-cyan/10 blur-3xl animate-glow-pulse" />
      {/* Outer ring — cyan */}
      <div className="absolute inset-0 rounded-full border border-accent-cyan/30" />
      {/* Inner ring — purple */}
      <div className="absolute inset-4 rounded-full border border-accent-purple/20" />
      {/* Image */}
      <div
        className="absolute inset-4 rounded-full overflow-hidden bg-bg-surface"
        style={{ width: size, height: size }}
      >
        <Image src={src} alt={alt} fill className="object-cover" style={{ objectPosition: '50% 15%' }} />
      </div>
    </div>
  )
}
