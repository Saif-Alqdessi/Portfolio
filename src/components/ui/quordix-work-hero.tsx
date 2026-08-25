'use client'

import React, { useRef, useEffect, useState } from 'react'
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
  useInView,
} from 'framer-motion'
import { Space_Grotesk } from 'next/font/google'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

/* ─────────────────────────────────────────────
   Inline useTouch hook
───────────────────────────────────────────── */
function useTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false)
  useEffect(() => {
    const check = () => setIsTouch(window.matchMedia('(pointer: coarse)').matches)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return isTouch
}

/* ─────────────────────────────────────────────
   Styles — follows the site's real light/dark theme via the same
   --background/--foreground CSS variables everything else uses.
   (No navbar styles here — this component no longer ships its own nav;
   the site's real Navbar, already in layout.tsx, covers that.)
───────────────────────────────────────────── */
const STYLES = `
  .wh-shell, .wh-shell *, .wh-shell *::before, .wh-shell *::after {
    box-sizing: border-box;
  }
  .wh-shell {
    font-family: var(--font-space-grotesk), sans-serif;
    background: hsl(var(--background));
    color: hsl(var(--foreground));
  }

  /* ── Orbit rings ── */
  @keyframes wh-orbit { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  @keyframes wh-orbit-rev { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }
  .wh-orbit { will-change: transform; }
`

/* ─────────────────────────────────────────────
   Shared animation types
───────────────────────────────────────────── */
interface AnimationItem {
  id: string
  type: 'letter' | 'word'
  centerRef: React.MutableRefObject<{ x: number; y: number }>
  motionValues: Record<string, any>
  radius: number
  force?: number
}

/* ─────────────────────────────────────────────
   MagneticLetter — each character in the heading
───────────────────────────────────────────── */
function MagneticLetter({
  children,
  registar,
  id,
}: {
  children: string
  registar: (item: AnimationItem) => () => void
  id: string
}) {
  const letterRef = useRef<HTMLSpanElement>(null)
  const centerRef = useRef({ x: 0, y: 0 })

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 }
  const motionValues = {
    x: useSpring(0, springConfig),
    y: useSpring(0, springConfig),
    skewX: useSpring(0, springConfig),
    scale: useSpring(1, springConfig),
  }

  useEffect(() => {
    const updateCache = () => {
      if (letterRef.current) {
        const rect = letterRef.current.getBoundingClientRect()
        centerRef.current = {
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + rect.height / 2 + window.scrollY,
        }
      }
    }
    updateCache()
    window.addEventListener('resize', updateCache)
    const unregister = registar({ id, type: 'letter', centerRef, motionValues, radius: 250, force: 0.4 })
    return () => {
      window.removeEventListener('resize', updateCache)
      unregister()
    }
  }, [])

  return (
    <motion.span
      ref={letterRef}
      style={{ x: motionValues.x, y: motionValues.y, skewX: motionValues.skewX, scale: motionValues.scale, display: 'inline-block', willChange: 'transform' }}
    >
      {children}
    </motion.span>
  )
}

/* ─────────────────────────────────────────────
   WeightWord — variable-weight subtitle words
───────────────────────────────────────────── */
function WeightWord({
  word,
  id,
  registar,
  isSpecial,
}: {
  word: string
  id: string
  registar: (item: AnimationItem) => () => void
  isSpecial: boolean
}) {
  const wordRef = useRef<HTMLSpanElement>(null)
  const centerRef = useRef({ x: 0, y: 0 })

  const springConfig = { stiffness: 80, damping: 20 }
  const motionValues = {
    weight: useSpring(300, springConfig),
    opacity: useSpring(0.7, springConfig),
  }

  useEffect(() => {
    const updateCache = () => {
      if (wordRef.current) {
        const rect = wordRef.current.getBoundingClientRect()
        centerRef.current = {
          x: rect.left + rect.width / 2 + window.scrollX,
          y: rect.top + rect.height / 2 + window.scrollY,
        }
      }
    }
    updateCache()
    window.addEventListener('resize', updateCache)
    const unregister = registar({ id, type: 'word', centerRef, motionValues, radius: 150 })
    return () => {
      window.removeEventListener('resize', updateCache)
      unregister()
    }
  }, [])

  return (
    <motion.span
      ref={wordRef}
      style={{
        fontWeight: motionValues.weight,
        opacity: motionValues.opacity,
        color: isSpecial ? '#f97316' : 'hsl(var(--foreground-secondary))',
        willChange: 'font-weight, opacity',
      }}
      className="inline-block mx-[0.15em] transition-colors duration-700"
    >
      {word}
    </motion.span>
  )
}

/* ─────────────────────────────────────────────
   Orbit ring config — matches original exactly
───────────────────────────────────────────── */
const RINGS = [
  { size: 35,  border: '1px', opacity: 0.10, speed: 60,   satellite: true,  color: 'slate'  },
  { size: 55,  border: '1px', opacity: 0.05, speed: -80,  satellite: false, color: 'slate'  },
  { size: 85,  border: '2px', opacity: 0.10, speed: 120,  satellite: true,  color: 'orange' },
  { size: 120, border: '1px', opacity: 0.03, speed: -150, satellite: true,  color: 'slate'  },
]

/* ─────────────────────────────────────────────
   Main WorkHero section
───────────────────────────────────────────── */
function WorkHeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { amount: 0.1 })

  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)
  const itemsRef = useRef<Map<string, AnimationItem>>(new Map())
  const isTouch = useTouch()

  const handleMouseMove = (e: React.MouseEvent) => { mouseX.set(e.pageX); mouseY.set(e.pageY) }
  const handleMouseLeave = () => { mouseX.set(-1000); mouseY.set(-1000) }
  const handleTouchStart = (e: React.TouchEvent) => { if (e.touches[0]) { mouseX.set(e.touches[0].pageX); mouseY.set(e.touches[0].pageY) } }
  const handleTouchMove = (e: React.TouchEvent) => { if (e.touches[0]) { mouseX.set(e.touches[0].pageX); mouseY.set(e.touches[0].pageY) } }
  const handleTouchEnd = () => { mouseX.set(-1000); mouseY.set(-1000) }

  const registerItem = (item: AnimationItem) => {
    itemsRef.current.set(item.id, item)
    return () => itemsRef.current.delete(item.id)
  }

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
    layoutEffect: false,
  })

  const yText = useTransform(scrollYProgress, [0, 1], [0, 150])
  const opacityFade = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useAnimationFrame(() => {
    if (!isInView) return
    const currentMouseX = mouseX.get()
    const currentMouseY = mouseY.get()
    const isInteracting = currentMouseX !== -1000
    // With no finger down there is no pointer to attract toward. Parking a
    // virtual magnet at the container's centre (the previous behaviour) pulled
    // every letter inward and scaled it permanently, which overlapped the
    // heading into an unreadable clump at phone widths. Rest instead; a real
    // touch still drives the effect via handleTouchStart/Move.
    const atRest = isTouch && !isInteracting
    const mx = atRest ? -10000 : currentMouseX
    const my = atRest ? -10000 : currentMouseY
    const yOffset = yText.get()

    itemsRef.current.forEach((item) => {
      if (!item.centerRef.current.x) return
      const dx = mx - item.centerRef.current.x
      const dy = my - (item.centerRef.current.y + yOffset)
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (item.type === 'letter') {
        if (distance < item.radius) {
          const power = (item.radius - distance) / item.radius
          const force = item.force || 0.4
          item.motionValues.x.set(dx * power * force)
          item.motionValues.y.set(dy * power * force)
          item.motionValues.skewX.set(dx * power * 0.1)
          item.motionValues.scale.set(1 + power * 0.15)
        } else {
          item.motionValues.x.set(0)
          item.motionValues.y.set(0)
          item.motionValues.skewX.set(0)
          item.motionValues.scale.set(1)
        }
      } else if (item.type === 'word') {
        if (distance < item.radius) {
          const power = (item.radius - distance) / item.radius
          item.motionValues.weight.set(300 + power * 400)
          item.motionValues.opacity.set(0.7 + power * 0.3)
        } else {
          item.motionValues.weight.set(300)
          item.motionValues.opacity.set(0.7)
        }
      }
    })
  })

  const title1 = 'SELECTED'
  const title2 = 'WORK'
  const subtitle =
    "AI systems, agents, and automation tools I've designed and shipped. Each one started with someone doing a job by hand that a machine could do better."

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        position: 'relative',
        height: '100svh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'hsl(var(--background))',
        cursor: 'default',
        touchAction: 'pan-y',
        contain: 'layout paint',
        userSelect: 'none',
      }}
    >
      {/* Background orbit rings */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
        {/* Dark amber centre glow */}
        <div style={{ position: 'absolute', width: '60vh', height: '60vh', background: 'rgba(249,115,22,0.12)', borderRadius: '9999px', filter: 'blur(48px)', opacity: 0.6, transform: 'translateZ(0)' }} />

        {RINGS.map((ring, i) => (
          <div
            key={i}
            className="wh-orbit"
            style={{
              position: 'absolute',
              borderRadius: '9999px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: `${ring.size}vh`,
              height: `${ring.size}vh`,
              borderWidth: ring.border,
              borderStyle: 'solid',
              borderColor: ring.color === 'orange'
                ? `rgba(249,115,22,${ring.opacity})`
                : `rgba(255,255,255,${ring.opacity})`,
              animation: `${ring.speed > 0 ? 'wh-orbit' : 'wh-orbit-rev'} ${Math.abs(ring.speed)}s linear infinite`,
            }}
          >
            {ring.satellite && (
              <div style={{
                position: 'absolute',
                top: 0,
                transform: 'translateY(-50%)',
                width: '6px',
                height: '6px',
                borderRadius: '9999px',
                background: ring.color === 'orange' ? '#f97316' : '#cbd5e1',
                boxShadow: ring.color === 'orange' ? '0 0 8px rgba(249,115,22,0.6)' : 'none',
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Content — parallax fades on scroll */}
      <motion.div
        style={{ y: yText, opacity: opacityFade, paddingTop: 'clamp(64px, 9vh, 110px)' }}
        className="relative z-20 flex flex-col items-center text-center px-4"
      >
        {/* "Selected Projects" label */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}
        >
          <span style={{ width: '2rem', height: '1px', background: '#fb923c', display: 'block' }} />
          <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 700, color: '#f97316', letterSpacing: '0.5em', textTransform: 'uppercase' }}>
            Selected Projects
          </span>
          <span style={{ width: '2rem', height: '1px', background: '#fb923c', display: 'block' }} />
        </motion.div>

        {/* SELECTED WORK heading */}
        {/* 700 is the heaviest weight Space Grotesk ships. Asking for 900
            makes the browser synthesise it, which draws each glyph wider than
            its advance width and overlaps the letters. */}
        <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 0.85, fontWeight: 700, letterSpacing: '-0.02em', userSelect: 'none', margin: 0 }}>
          {/* SELECTED — dark */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.05 } } }}
            style={{ display: 'flex', gap: '0.02em', fontSize: 'clamp(2.4rem, 8vw, 6rem)', color: 'hsl(var(--foreground))', marginBottom: '0.1em' }}
          >
            {title1.split('').map((char, i) => (
              <motion.span
                key={`t1-${i}`}
                variants={{
                  initial: { y: '100%', opacity: 0 },
                  animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <MagneticLetter id={`char-1-${i}`} registar={registerItem}>{char}</MagneticLetter>
              </motion.span>
            ))}
          </motion.div>

          {/* WORK — orange */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={{ animate: { transition: { staggerChildren: 0.05, delayChildren: 0.4 } } }}
            style={{ display: 'flex', gap: '0.05em', fontSize: 'clamp(3rem, 10vw, 7rem)', color: '#f97316', paddingTop: '0.25em', paddingBottom: '0.25em' }}
          >
            {title2.split('').map((char, i) => (
              <motion.span
                key={`t2-${i}`}
                variants={{
                  initial: { y: '100%', opacity: 0 },
                  animate: { y: 0, opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
                }}
              >
                <MagneticLetter id={`char-2-${i}`} registar={registerItem}>{char}</MagneticLetter>
              </motion.span>
            ))}
          </motion.div>
        </h1>

        {/* Subtitle — variable-weight words */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 1 }}
          style={{ marginTop: '1.5rem', maxWidth: '42rem', fontSize: 'clamp(0.9rem, 1.8vw, 1.1rem)', letterSpacing: '0.02em', lineHeight: 1.7, display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}
        >
          {subtitle.split(' ').map((word, i) => {
            const isSpecial = ['ai', 'agents', 'automation'].includes(
              word.toLowerCase().replace(/[^a-z]/g, '')
            )
            return (
              <WeightWord key={i} id={`word-${i}`} word={word} registar={registerItem} isSpecial={isSpecial} />
            )
          })}
        </motion.div>
      </motion.div>

      {/* Bottom fade — absorbs the orbit rings'/glow's hard overflow:hidden
          cutoff into the flat page background, instead of an abrupt edge
          where the section below begins. */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '40vh',
          zIndex: 10,
          pointerEvents: 'none',
          background: 'linear-gradient(to bottom, transparent 0%, hsl(var(--background)) 100%)',
        }}
      />
    </section>
  )
}

/* ─────────────────────────────────────────────
   Root export — no embedded navbar/logo: the site's
   real Navbar (in layout.tsx) already covers every page,
   including this one, so this component owns hero content only.
───────────────────────────────────────────── */
export function QuordixWorkHero() {
  return (
    <div
      className={`wh-shell ${spaceGrotesk.variable}`}
      style={{
        position: 'relative',
        minHeight: '100svh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: 'hsl(var(--background))',
      }}
    >
      <style>{STYLES}</style>
      <WorkHeroSection />
    </div>
  )
}
