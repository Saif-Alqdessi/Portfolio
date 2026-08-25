'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { VisualTag, type VisualProps } from './shared'

const LINE_PATH = 'M0,38 C10,35 15,20 25,22 C35,24 38,10 50,12 C62,14 65,30 75,26 C85,22 90,8 100,10'

export function FinancialVisual({ isHovered }: VisualProps) {
  const prefersReduced = useReducedMotion()
  const drawDuration = isHovered ? 1.3 : 2.4

  return (
    <div className="relative h-full w-full">
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="fin-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={`${LINE_PATH} L100,50 L0,50 Z`} fill="url(#fin-fill)" />
        {prefersReduced ? (
          <path d={LINE_PATH} fill="none" stroke="#f59e0b" strokeWidth={1.2} strokeLinecap="round" />
        ) : (
          <motion.path
            d={LINE_PATH}
            fill="none"
            stroke="#f59e0b"
            strokeWidth={1.2}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1] }}
            transition={{ duration: drawDuration, repeat: Infinity, times: [0, 0.7, 1], ease: 'easeInOut' }}
          />
        )}
        <motion.circle
          cx={100}
          cy={10}
          r={2}
          fill="#f59e0b"
          animate={prefersReduced ? undefined : { opacity: [1, 0.35, 1] }}
          transition={{ duration: 1.4, repeat: Infinity }}
        />
      </svg>

      <div className="absolute left-2 top-2">
        <VisualTag className="border-accent-purple/40 bg-accent-purple/10 text-accent-purple" delay={0.15}>
          +24.8%
        </VisualTag>
      </div>
      <div className="absolute bottom-2 left-2">
        <VisualTag className="border-zinc-500/30 bg-zinc-900/60 text-zinc-300" delay={0.4}>
          Risk: Low
        </VisualTag>
      </div>
    </div>
  )
}
