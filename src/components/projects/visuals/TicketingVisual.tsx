'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { VisualTag, type VisualProps } from './shared'

// Fixed pattern — deterministic, not Math.random(), so SSR and client markup match.
const QR_SIZE = 7
const QR_PATTERN = [
  1, 0, 1, 1, 0, 1, 0,
  0, 1, 0, 0, 1, 0, 1,
  1, 1, 1, 0, 1, 1, 0,
  0, 0, 1, 1, 0, 0, 1,
  1, 0, 0, 1, 1, 0, 1,
  0, 1, 1, 0, 0, 1, 0,
  1, 0, 1, 0, 1, 1, 1,
]

export function TicketingVisual({ isHovered }: VisualProps) {
  const prefersReduced = useReducedMotion()
  const pingDuration = isHovered ? 1.6 : 3.2

  return (
    <div className="relative flex h-full w-full items-center justify-center">
      <div className="relative rounded-lg border border-accent-purple/30 bg-zinc-950/50 p-2.5">
        <div
          className="grid gap-[2px]"
          style={{ gridTemplateColumns: `repeat(${QR_SIZE}, minmax(0, 1fr))` }}
        >
          {QR_PATTERN.map((on, i) => (
            <span
              key={i}
              className={`h-1.5 w-1.5 rounded-[1px] ${on ? 'bg-accent-purple/70' : 'bg-transparent'}`}
            />
          ))}
        </div>

        {/* Corner-scanning bracket */}
        {!prefersReduced && (
          <motion.span
            className="pointer-events-none absolute left-0 top-0 h-3 w-3 rounded-sm border-l-2 border-t-2 border-accent-purple"
            animate={{
              x: [0, 'calc(100% - 12px)', 'calc(100% - 12px)', 0, 0],
              y: [0, 0, 'calc(100% - 12px)', 'calc(100% - 12px)', 0],
            }}
            transition={{
              duration: pingDuration,
              repeat: Infinity,
              ease: 'linear',
              times: [0, 0.25, 0.5, 0.75, 1],
            }}
          />
        )}
      </div>

      <div className="absolute left-2 top-2">
        <VisualTag className="border-emerald-500/40 bg-emerald-500/10 text-emerald-400" delay={0.2}>
          Status: Verified ✓
        </VisualTag>
      </div>
      <div className="absolute bottom-2 right-2">
        <VisualTag className="border-zinc-500/30 bg-zinc-900/60 text-zinc-300" delay={0.5}>
          Access: Granted
        </VisualTag>
      </div>
    </div>
  )
}
