'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedRolesProps {
  roles: string[]
  /** Leading label, e.g. "I build". Pass "" to omit it entirely. */
  prefix?: string
  align?: 'left' | 'center'
  /** Overrides the role text's size/weight/tracking. Defaults to the Hero's large treatment. */
  textClassName?: string
  /** Height of one stacked row, in rem — must match the role text's own line height. */
  rowHeightRem?: number
}

export function AnimatedRoles({
  roles,
  prefix = 'I build',
  align = 'left',
  textClassName,
  rowHeightRem = 2,
}: AnimatedRolesProps) {
  const list = roles.length > 0 ? roles : ['AI Systems Engineer']
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (list.length <= 1) return
    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % list.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [list.length])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 15 }}
      className={cn('flex flex-wrap items-center gap-2', align === 'center' && 'justify-center')}
    >
      {prefix && (
        <p className="text-xl font-medium text-gray-300 [text-shadow:0_2px_16px_rgba(0,0,0,0.5)] sm:text-2xl">
          {prefix}
        </p>
      )}
      <div className="overflow-hidden text-center" style={{ height: `${rowHeightRem}rem` }}>
        <div
          className="transition-transform duration-700 ease-in-out"
          style={{ transform: `translateY(-${index * rowHeightRem}rem)` }}
        >
          {list.map((role, i) => (
            <p
              key={role + i}
              style={{ height: `${rowHeightRem}rem` }}
              className={cn(
                'flex items-center whitespace-nowrap font-bold tracking-tight [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]',
                align === 'center' ? 'justify-center' : 'justify-start',
                textClassName ?? 'text-xl sm:text-2xl',
                i % 2 === 0 ? 'text-accent-cyan' : 'text-accent-purple'
              )}
            >
              {role}
            </p>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
