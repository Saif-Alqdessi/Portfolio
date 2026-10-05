'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'framer-motion'

// Pre-rendered motion clip (2:1, seamless loop, no audio) that fills the
// card's preview box. Reduced-motion users get the static poster frame.
export function ProjectVideo({ src, poster, label }: { src: string; poster: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (prefersReduced) v.pause()
    else v.play().catch(() => {})
  }, [prefersReduced])

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      aria-label={label}
      muted
      loop
      playsInline
      autoPlay={!prefersReduced}
      preload="metadata"
      className="absolute inset-0 h-full w-full max-w-full object-cover"
    />
  )
}
