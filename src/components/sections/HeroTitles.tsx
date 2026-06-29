'use client'

import { useState, useEffect } from 'react'

interface HeroTitlesProps {
  titles: string[]
}

export function HeroTitles({ titles }: HeroTitlesProps) {
  const [index, setIndex] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    if (titles.length <= 1) return
    const timer = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setIndex(i => (i + 1) % titles.length)
        setFade(true)
      }, 400)
    }, 2500)
    return () => clearInterval(timer)
  }, [titles.length])

  return (
    <span
      className="text-accent-cyan transition-opacity duration-500"
      style={{ opacity: fade ? 1 : 0 }}
    >
      {titles[index] ?? ''}
    </span>
  )
}
