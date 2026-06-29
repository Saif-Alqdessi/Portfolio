'use client'

import { useEffect, useRef, useState } from 'react'
import { Briefcase, Award, Users, Building2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeonIcon } from '@/components/ui/NeonIcon'
import { cn } from '@/lib/utils'

const ICON_MAP: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  award:     Award,
  users:     Users,
  building2: Building2,
}

interface CountUpStatProps {
  value: number
  prefix: string
  suffix: string
  label: string
  description: string
  iconName: string
  color: 'cyan' | 'purple'
  delay?: number
}

export function CountUpStat({
  value,
  prefix,
  suffix,
  label,
  description,
  iconName,
  color,
  delay = 0,
}: CountUpStatProps) {
  const icon = ICON_MAP[iconName] ?? Briefcase
  const [count, setCount] = useState(0)
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTriggered(true) },
      { threshold: 0.3 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!triggered) return
    const timeout = setTimeout(() => {
      const duration = 1400
      const fps = 60
      const steps = (duration / 1000) * fps
      const increment = value / steps
      let current = 0
      const interval = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(interval)
        } else {
          setCount(Math.floor(current))
        }
      }, 1000 / fps)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(timeout)
  }, [triggered, value, delay])

  return (
    <div ref={ref}>
      <GlassCard
        variant="default"
        className="h-full flex flex-col items-center text-center gap-5 py-8 px-5 hover:border-white/10 hover:-translate-y-1 transition-transform duration-300"
      >
        <NeonIcon icon={icon as LucideIcon} size="md" color={color} />
        <div className="space-y-1.5">
          <p
            className={cn(
              'text-4xl sm:text-5xl font-bold font-mono tabular-nums',
              color === 'cyan' ? 'text-accent-cyan' : 'text-accent-purple'
            )}
          >
            {prefix}{count}{suffix}
          </p>
          <p className="text-text-primary font-semibold text-sm sm:text-base">{label}</p>
          <p className="text-text-muted text-xs sm:text-sm leading-snug">{description}</p>
        </div>
      </GlassCard>
    </div>
  )
}
