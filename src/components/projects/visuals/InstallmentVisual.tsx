'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { VisualTag, type VisualProps } from './shared'

// A fixed installment schedule — deterministic, not random, so SSR and
// client markup match. One overdue entry is the whole point of the visual.
const SCHEDULE: { x: number; status: 'paid' | 'overdue' | 'due' | 'upcoming' }[] = [
  { x: 8, status: 'paid' },
  { x: 24, status: 'paid' },
  { x: 40, status: 'paid' },
  { x: 56, status: 'overdue' },
  { x: 72, status: 'due' },
  { x: 88, status: 'upcoming' },
]

const STATUS_CLASS: Record<string, string> = {
  paid: 'fill-emerald-500/70 stroke-emerald-500',
  overdue: 'fill-red-500/20 stroke-red-500',
  due: 'fill-accent-purple/20 stroke-accent-purple',
  upcoming: 'fill-transparent stroke-zinc-600',
}

// Fixed tail values — stands in for decimal.js recalculating to full
// precision before the UI settles on a rounded display figure.
const BALANCE_TICKS = ['$128,406.50', '$128,406.5183', '$128,406.4927', '$128,406.5061', '$128,406.50']

function TickingBalance({ isHovered }: VisualProps) {
  const prefersReduced = useReducedMotion()
  const [i, setI] = useState(0)

  useEffect(() => {
    if (prefersReduced) return
    const id = setInterval(
      () => setI((prev) => (prev + 1) % BALANCE_TICKS.length),
      isHovered ? 350 : 700
    )
    return () => clearInterval(id)
  }, [isHovered, prefersReduced])

  return (
    <div className="text-center">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-text-muted/70">Net Worth</p>
      <p className="font-mono text-sm font-semibold tabular-nums text-text-primary">
        {BALANCE_TICKS[prefersReduced ? BALANCE_TICKS.length - 1 : i]}
      </p>
    </div>
  )
}

export function InstallmentVisual({ isHovered }: VisualProps) {
  const prefersReduced = useReducedMotion()
  const pulseDuration = isHovered ? 0.8 : 1.5

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center gap-4">
      <TickingBalance isHovered={isHovered} />

      <svg viewBox="0 0 96 20" className="w-4/5">
        <line x1="8" y1="10" x2="88" y2="10" className="stroke-zinc-700" strokeWidth={0.6} />
        {SCHEDULE.map((s, i) => (
          <g key={i}>
            {s.status === 'overdue' && !prefersReduced && (
              <motion.circle
                cx={s.x}
                cy={10}
                r={3}
                className="fill-none stroke-red-500/50"
                strokeWidth={0.6}
                animate={{ r: [3, 6], opacity: [0.6, 0] }}
                transition={{ duration: pulseDuration, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <circle cx={s.x} cy={10} r={3} strokeWidth={0.8} className={STATUS_CLASS[s.status]} />
          </g>
        ))}
      </svg>

      <div className="absolute bottom-2 left-2">
        <VisualTag className="border-red-500/40 bg-red-500/10 text-red-400" delay={0.2}>
          1 Overdue
        </VisualTag>
      </div>
      <div className="absolute bottom-2 right-2">
        <VisualTag className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400" delay={0.4}>
          200+ Tests Passing
        </VisualTag>
      </div>
    </div>
  )
}
