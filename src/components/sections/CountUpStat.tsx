'use client'

import { useEffect, useRef, useState } from 'react'
import { Briefcase, Award, Users, BookOpen, BrainCircuit } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  award:     Award,
  users:     Users,
  bookopen:  BookOpen,
  brain:     BrainCircuit,
}

interface CountUpStatProps {
  value: number
  prefix: string
  suffix: string
  label: string
  description: string
  iconName: string
  delay?: number
}

export function CountUpStat({
  value,
  prefix,
  suffix,
  label,
  description,
  iconName,
  delay = 0,
}: CountUpStatProps) {
  const Icon = ICON_MAP[iconName] ?? Briefcase
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
    <div
      ref={ref}
      className="group relative overflow-hidden rounded-2xl border border-foreground/8 bg-gradient-to-b from-bg-surface/80 to-bg-surface/30 p-8 transition-all duration-500 ease-out hover:-translate-y-1 hover:border-accent-purple/25"
    >
      {/* Ambient glow, clipped to the card so it reads as light from within, not a floating blob */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent-purple/25 opacity-0 blur-3xl transition-opacity duration-700 ease-out group-hover:opacity-100"
      />

      <div className="relative space-y-5">
        <Icon
          size={18}
          strokeWidth={1.5}
          className="text-text-muted transition-colors duration-500 group-hover:text-accent-purple/70"
        />

        <div className="space-y-1.5">
          <p className="font-mono text-5xl font-semibold tabular-nums tracking-tight text-accent-purple [text-shadow:0_0_24px_rgba(245,158,11,0)] transition-[text-shadow] duration-500 ease-out group-hover:[text-shadow:0_0_24px_rgba(245,158,11,0.35)] sm:text-6xl">
            {prefix}{count}{suffix}
          </p>
          <p className="text-sm font-semibold text-text-primary">{label}</p>
          <p className="text-xs leading-relaxed text-text-muted">{description}</p>
        </div>
      </div>
    </div>
  )
}
