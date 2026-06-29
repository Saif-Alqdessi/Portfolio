'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { label: 'Track Record', href: '#track-record' },
  { label: 'About',        href: '#about' },
  { label: 'What I Do',   href: '#what-i-do' },
  { label: 'Projects',     href: '#projects' },
  { label: 'Approach',     href: '#approach' },
  { label: 'Stack',        href: '#stack' },
  { label: 'Contact',      href: '#contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-300',
        scrolled
          ? 'glass border-b border-white/5 shadow-glass'
          : 'bg-transparent'
      )}
    >
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#hero"
          className="font-mono text-sm font-bold tracking-wider text-text-primary hover:text-accent-cyan transition-colors"
        >
          SAIF<span className="text-accent-cyan">.</span>AI
        </a>

        {/* Links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={href}
              href={href}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200"
            >
              {label}
            </a>
          ))}
          <a
            href="/admin"
            className="text-xs font-mono px-3 py-1.5 rounded-lg border border-accent-cyan/30 text-accent-cyan hover:bg-accent-cyan/10 transition-all duration-200"
          >
            ADMIN
          </a>
        </div>
      </nav>
    </header>
  )
}
