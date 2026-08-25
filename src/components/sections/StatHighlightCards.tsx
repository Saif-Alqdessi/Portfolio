'use client'

import { useEffect, useRef, useState } from 'react'
import { Briefcase, Award, Users, BookOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { DisplayCards } from '@/components/ui/display-cards'
import type { Database } from '@/lib/supabase/types'

type StatRow = Database['public']['Tables']['stats']['Row']

const ICON_MAP: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  award:     Award,
  users:     Users,
  bookopen:  BookOpen,
}

interface StatMeta {
  iconName: string
  description: string
}

interface StatHighlightCardsProps {
  stats: StatRow[]
  meta: StatMeta[]
}

function useCountUp(value: number, triggered: boolean, delay: number) {
  const [count, setCount] = useState(0)

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

  return count
}

function AnimatedStatTitle({
  value,
  prefix,
  suffix,
  triggered,
  delay,
}: {
  value: number
  prefix: string
  suffix: string
  triggered: boolean
  delay: number
}) {
  const count = useCountUp(value, triggered, delay)
  return <>{prefix}{count}{suffix}</>
}

export function StatHighlightCards({ stats, meta }: StatHighlightCardsProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [triggered, setTriggered] = useState(false)

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

  const cards = stats.map((stat, i) => {
    const m = meta[i] ?? meta[0]
    const Icon = ICON_MAP[m.iconName] ?? Briefcase
    return {
      icon: <Icon size={20} strokeWidth={1.5} className="text-accent-purple" />,
      title: (
        <AnimatedStatTitle
          value={stat.value}
          prefix={stat.prefix}
          suffix={stat.suffix}
          triggered={triggered}
          delay={i * 150}
        />
      ),
      description: stat.label,
      date: m.description,
    }
  })

  return (
    <div ref={ref}>
      <DisplayCards cards={cards} />
    </div>
  )
}
