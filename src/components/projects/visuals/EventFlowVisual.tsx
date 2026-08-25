'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { VisualTag, type VisualProps } from './shared'

// Fixed 5x5 grid of "landmark" points — deterministic, not random, so
// server and client render identical markup.
const GRID = Array.from({ length: 5 }, (_, row) =>
  Array.from({ length: 5 }, (_, col) => ({ row, col }))
).flat()

export function EventFlowVisual({ isHovered }: VisualProps) {
  const prefersReduced = useReducedMotion()
  const scanDuration = isHovered ? 1.2 : 2.4

  return (
    <div className="relative h-full w-full">
      {/* Biometric landmark mesh */}
      <svg viewBox="0 0 100 100" className="h-full w-full opacity-50">
        {GRID.map(({ row, col }) => (
          <circle
            key={`dot-${row}-${col}`}
            cx={14 + col * 18}
            cy={14 + row * 18}
            r={1.1}
            className="fill-accent-purple"
          />
        ))}
        {GRID.filter(({ col }) => col < 4).map(({ row, col }) => (
          <line
            key={`h-${row}-${col}`}
            x1={14 + col * 18}
            y1={14 + row * 18}
            x2={14 + (col + 1) * 18}
            y2={14 + row * 18}
            className="stroke-accent-purple/25"
            strokeWidth={0.4}
          />
        ))}
        {GRID.filter(({ row }) => row < 4).map(({ row, col }) => (
          <line
            key={`v-${row}-${col}`}
            x1={14 + col * 18}
            y1={14 + row * 18}
            x2={14 + col * 18}
            y2={14 + (row + 1) * 18}
            className="stroke-accent-purple/25"
            strokeWidth={0.4}
          />
        ))}
      </svg>

      {/* Vertical scanning beam, sweeping horizontally */}
      {!prefersReduced && (
        <motion.div
          className="absolute inset-y-2 left-1/2 w-10 bg-gradient-to-r from-transparent via-accent-purple/50 to-transparent"
          animate={{ x: ['-2.75rem', '2.75rem', '-2.75rem'] }}
          transition={{ duration: scanDuration, repeat: Infinity, ease: 'linear' }}
        />
      )}

      <div className="absolute left-2 top-2">
        <VisualTag className="border-accent-purple/40 bg-accent-purple/10 text-accent-purple" delay={0.15}>
          Match: 99.4%
        </VisualTag>
      </div>
      <div className="absolute bottom-2 right-2">
        <VisualTag className="border-zinc-500/30 bg-zinc-900/60 text-zinc-300" delay={0.45}>
          Embedding: 512-d
        </VisualTag>
      </div>
    </div>
  )
}
