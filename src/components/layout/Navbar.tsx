'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'

const NAV_LINKS = [
  { label: 'Home',        href: '/' },
  { label: 'About Me',    href: '/about' },
  { label: 'Projects',    href: '/projects' },
  { label: 'Contact Me',  href: '/#contact' },
]

export function Navbar() {
  const [open, setOpen] = useState(false)

  // Lock background scroll while the drawer is open. Restoring to '' rather
  // than a literal value lets globals.css keep its own overflow-x rule.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4 sm:top-6">
      {/* Desktop: centred pill */}
      <nav className="glass mx-auto hidden h-12 w-fit items-center gap-8 rounded-full pl-6 pr-3 md:flex">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-text-primary transition-colors hover:text-accent-purple"
        >
          Saif Alqdessi
        </Link>
        <div className="h-5 w-px bg-foreground/10" aria-hidden="true" />
        {NAV_LINKS.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className="text-sm text-text-secondary transition-colors duration-200 hover:text-text-primary"
          >
            {label}
          </Link>
        ))}
        <div className="h-5 w-px bg-foreground/10" aria-hidden="true" />
        <ThemeToggle />
      </nav>

      {/* Mobile: brand + controls bar */}
      <div className="glass flex h-14 items-center justify-between rounded-full pl-5 pr-2 md:hidden">
        <Link
          href="/"
          className="-my-2 inline-flex min-h-[2.75rem] items-center text-sm font-semibold tracking-tight text-text-primary"
          onClick={() => setOpen(false)}
        >
          Saif Alqdessi
        </Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            className="flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-foreground/5 hover:text-text-primary"
          >
            <Menu size={20} strokeWidth={1.75} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="drawer"
            className="fixed inset-0 z-50 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            <motion.nav
              className="absolute inset-x-4 top-4 overflow-hidden rounded-3xl border border-foreground/10 bg-bg-surface/95 p-3 shadow-glass backdrop-blur-xl"
              initial={{ y: -16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -16, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
              aria-label="Site"
            >
              <div className="flex items-center justify-between pb-2 pl-3">
                <span className="text-sm font-semibold tracking-tight text-text-primary">
                  Saif Alqdessi
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="flex h-11 w-11 items-center justify-center rounded-full text-text-secondary transition-colors hover:bg-foreground/5 hover:text-text-primary"
                >
                  <X size={20} strokeWidth={1.75} />
                </button>
              </div>

              <ul className="flex flex-col">
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="flex min-h-[3.25rem] items-center rounded-2xl px-3 text-base font-medium text-text-secondary transition-colors hover:bg-foreground/5 hover:text-accent-purple"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
