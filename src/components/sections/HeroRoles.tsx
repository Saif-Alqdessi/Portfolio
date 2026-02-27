'use client'

import { useState, useEffect, useRef } from 'react'

const ROLES = [
  'AI Systems Engineer',
  'Agent Engineer',
  'ML Engineer',
  'RAG Engineer',
  'Automation Engineer',
]

const TYPING_MS  = 60   // ms per character while typing
const ERASING_MS = 38   // ms per character while erasing
const PAUSE_MS   = 2000 // ms to hold full word before erasing
const GAP_MS     = 380  // ms of empty pause before next word

interface HeroRolesProps {
  roles?: string[]
}

export function HeroRoles({ roles = ROLES }: HeroRolesProps) {
  const list                          = roles.length > 0 ? roles : ROLES
  const [index,    setIndex]          = useState(0)
  const [text,     setText]           = useState('')
  const [phase,    setPhase]          = useState<'typing' | 'pause' | 'erasing' | 'gap'>('typing')
  const [visible,  setVisible]        = useState(true)
  const timerRef                      = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reducedRef                    = useRef(false)

  useEffect(() => {
    reducedRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (reducedRef.current) {
      setText(list[index] ?? '')
      return
    }

    const current = list[index] ?? ''

    function clear() {
      if (timerRef.current) clearTimeout(timerRef.current)
    }

    function next(fn: () => void, delay: number) {
      clear()
      timerRef.current = setTimeout(fn, delay)
    }

    if (phase === 'typing') {
      if (text.length < current.length) {
        next(() => setText(current.slice(0, text.length + 1)), TYPING_MS)
      } else {
        next(() => setPhase('pause'), PAUSE_MS)
      }
    } else if (phase === 'pause') {
      setPhase('erasing')
    } else if (phase === 'erasing') {
      if (text.length > 0) {
        next(() => setText(t => t.slice(0, -1)), ERASING_MS)
      } else {
        setVisible(false)
        next(() => {
          setIndex(i => (i + 1) % list.length)
          setPhase('gap')
        }, GAP_MS / 2)
      }
    } else {
      next(() => {
        setVisible(true)
        setPhase('typing')
      }, GAP_MS / 2)
    }

    return clear
  }, [phase, text, index, list])

  return (
    <p
      className="text-base sm:text-xl font-medium tracking-wide min-h-[2rem] flex items-center justify-center gap-[2px]"
      aria-label={list[index]}
    >
      <span
        className="text-accent-cyan transition-opacity duration-300"
        style={{ opacity: visible ? 1 : 0 }}
      >
        {text}
      </span>
      <span
        className="inline-block w-[2px] h-[1.15em] rounded-sm bg-accent-cyan"
        style={{ animation: 'hero-blink 1.1s step-end infinite' }}
        aria-hidden="true"
      />
      <style>{`
        @keyframes hero-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </p>
  )
}
