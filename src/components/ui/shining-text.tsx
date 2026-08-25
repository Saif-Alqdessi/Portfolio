'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ShiningTextProps {
  text: string
  className?: string
}

export function ShiningText({ text, className }: ShiningTextProps) {
  return (
    <motion.p
      className={cn(
        'bg-[linear-gradient(110deg,#f8fafc,45%,#f59e0b,55%,#f8fafc)] bg-[length:200%_100%] bg-clip-text text-transparent',
        className
      )}
      initial={{ backgroundPosition: '200% 0' }}
      animate={{ backgroundPosition: '-200% 0' }}
      transition={{
        repeat: Infinity,
        duration: 4,
        ease: 'linear',
      }}
    >
      {text}
    </motion.p>
  )
}
