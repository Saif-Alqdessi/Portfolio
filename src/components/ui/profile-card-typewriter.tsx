'use client'

import { useEffect, useRef, useState } from 'react'

// Deliberately hardcoded, not Supabase-driven — this is a fixed identity
// tagline for the About page's profile card, not the CMS-editable titles
// used elsewhere (see AnimatedRoles for that).
const TITLES = ['AI Engineer', 'Systems Architect', 'AI Agent Developer', 'Automation Engineer']

const TYPING_MS  = 60
const ERASING_MS = 38
const PAUSE_MS   = 2000
const GAP_MS     = 380

export function ProfileCardTypewriter() {
  const [index,   setIndex]   = useState(0)
  const [text,    setText]    = useState('')
  const [phase,   setPhase]   = useState<'typing' | 'pause' | 'erasing' | 'gap'>('typing')
  const [visible, setVisible] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const reducedRef = useRef(false)

  useEffect(() => {
    reducedRef.current =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  useEffect(() => {
    if (reducedRef.current) {
      setText(TITLES[index] ?? '')
      return
    }

    const current = TITLES[index] ?? ''

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
          setIndex(i => (i + 1) % TITLES.length)
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
  }, [phase, text, index])

  return (
    <p
      className="flex items-center justify-center gap-[2px] text-xs font-semibold uppercase tracking-[0.2em] text-accent-purple"
      aria-label={TITLES[index]}
    >
      <span className="transition-opacity duration-300" style={{ opacity: visible ? 1 : 0 }}>
        {text}
      </span>
      <span
        className="inline-block h-[1em] w-[1.5px] animate-cursor-blink rounded-sm bg-accent-purple"
        aria-hidden="true"
      />
    </p>
  )
}
