'use client'

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface VisualProps {
  isHovered: boolean
}

export function VisualTag({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className={cn(
        'pointer-events-none select-none whitespace-nowrap rounded-full border px-2 py-0.5 font-mono text-[9px] tracking-wide backdrop-blur-sm',
        className
      )}
    >
      {children}
    </motion.span>
  )
}
