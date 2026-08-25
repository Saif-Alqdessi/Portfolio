'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { VisualProps } from './shared'

const NODES = [
  { label: 'Interviewer', x: 50, y: 20 },
  { label: 'Fact-Checker', x: 20, y: 72 },
  { label: 'Evaluator', x: 80, y: 72 },
]

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 0],
]

export function HrInterviewerVisual({ isHovered }: VisualProps) {
  const prefersReduced = useReducedMotion()
  const flowDuration = isHovered ? 1.4 : 2.8
  const waveDuration = isHovered ? 0.55 : 0.9

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 100 100" className="h-full w-full">
        {EDGES.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            className="stroke-accent-purple/40"
            strokeWidth={0.6}
            strokeDasharray="3 2.5"
            animate={prefersReduced ? undefined : { strokeDashoffset: [0, -11] }}
            transition={{ duration: flowDuration, repeat: Infinity, ease: 'linear' }}
          />
        ))}
        {NODES.map((n, i) => (
          <motion.circle
            key={n.label}
            cx={n.x}
            cy={n.y}
            r={4.5}
            className="fill-accent-purple/20 stroke-accent-purple"
            strokeWidth={0.8}
            animate={prefersReduced ? undefined : { opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3, ease: 'easeInOut' }}
          />
        ))}
      </svg>

      {NODES.map((n) => (
        <span
          key={n.label}
          style={{ left: `${n.x}%`, top: `${n.y}%` }}
          className="absolute -translate-x-1/2 translate-y-2 whitespace-nowrap font-mono text-[8px] uppercase tracking-wide text-zinc-400"
        >
          {n.label}
        </span>
      ))}

      {/* Live soundwave */}
      <div className="absolute bottom-0.5 left-1/2 flex -translate-x-1/2 items-end gap-[3px]">
        {[3, 8, 5, 12, 6, 9, 4].map((h, i) => (
          <motion.span
            key={i}
            className="w-[2px] rounded-full bg-accent-purple/70"
            animate={prefersReduced ? { height: 4 } : { height: [3, h, 3] }}
            transition={{ duration: waveDuration, repeat: Infinity, delay: i * 0.07, ease: 'easeInOut' }}
          />
        ))}
      </div>
    </div>
  )
}
