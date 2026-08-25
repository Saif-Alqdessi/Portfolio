'use client'

import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { ArrowUpRight, Download, Cpu, Bot, Award, Quote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { ProfileCardTypewriter } from '@/components/ui/profile-card-typewriter'

const SKILL_BADGES = [
  { label: 'AI Engineer', Icon: Cpu },
  { label: 'Systems Architect', Icon: Bot },
  { label: 'Community Leader', Icon: Award },
]

interface SocialLinkItem {
  label: string
  description: string
  href: string | null
  icon: ReactNode
  isEmail?: boolean
}

interface GlassmorphismPortfolioProps {
  name: string
  tagline: string
  bioParagraphs: string[]
  blurb: string
  photoUrl: string
  socialLinks: SocialLinkItem[]
  ctaHref: string
  ctaLabel: string
}

const listVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, staggerChildren: 0.08 },
  },
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}

export function GlassmorphismPortfolio({
  name,
  tagline,
  bioParagraphs,
  blurb,
  photoUrl,
  socialLinks,
  ctaHref,
  ctaLabel,
}: GlassmorphismPortfolioProps) {
  return (
    <section className="relative min-h-screen overflow-hidden px-6 pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-bg-surface/50 p-8 backdrop-blur-2xl md:p-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/[0.05] via-transparent to-transparent" />

          <div className="relative grid gap-12 lg:grid-cols-2">
            {/* Left column - main content */}
            <div className="space-y-8">
              <Badge variant="outline" className="bg-bg-surface/50 uppercase tracking-[0.3em]">
                Who I Am
              </Badge>

              <div className="space-y-6">
                <div className="space-y-1">
                  <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl font-bold tracking-tight text-foreground md:text-4xl"
                  >
                    {name}
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="text-lg font-medium text-accent-purple md:text-xl"
                  >
                    {tagline}
                  </motion.p>
                </div>
                <div className="max-w-xl space-y-5">
                  {bioParagraphs.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                      className="text-base leading-relaxed text-text-secondary sm:text-[1.05rem]"
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </div>
              </div>

              {/* Skill badges */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                {SKILL_BADGES.map(({ label, Icon }) => (
                  <span
                    key={label}
                    className="flex items-center gap-2 rounded-xl border border-foreground/10 bg-bg-surface/40 px-4 py-2 text-sm text-text-secondary backdrop-blur"
                  >
                    <Icon size={15} strokeWidth={1.5} className="text-accent-purple" />
                    {label}
                  </span>
                ))}
              </motion.div>

              {/* Quote */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative overflow-hidden rounded-2xl border border-foreground/10 bg-bg-surface/40 p-5"
              >
                <div className="absolute inset-y-0 left-0 w-1 bg-accent-purple/50" aria-hidden="true" />
                <div className="flex items-start gap-3 pl-2">
                  <Quote size={16} strokeWidth={1.5} className="mt-0.5 flex-shrink-0 text-accent-purple" />
                  <p className="text-sm italic leading-relaxed text-text-secondary">
                    If a person is doing it the same way every time, it should be a system.
                  </p>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <a
                  href={ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-accent-cyan px-8 text-sm font-semibold uppercase tracking-[0.25em] text-bg-base shadow-glow-cyan transition-all duration-200 hover:bg-accent-cyan-dim hover:shadow-none sm:w-auto"
                >
                  {ctaLabel}
                  <Download className="h-4 w-4 transition-transform duration-200 group-hover:translate-y-0.5" />
                </a>
              </motion.div>
            </div>

            {/* Right column - profile card. `self-start` keeps the card at its
                natural height instead of stretching to match the (much taller)
                bio column, which is what pushed the social links to the bottom
                edge and opened a gap in the middle. */}
            <div className="relative self-start">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-accent-cyan/15 via-transparent to-transparent blur-3xl" />
              <div className="relative flex flex-col overflow-hidden rounded-[28px] border border-foreground/10 bg-bg-surface/70 p-8 backdrop-blur-xl">
                <div className="flex flex-col items-center text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="relative mb-6"
                  >
                    <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-cyan/20 blur-2xl" />
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={photoUrl}
                      alt={name}
                      className="relative h-32 w-32 rounded-full border border-foreground/15 object-cover shadow-[0_25px_60px_rgba(15,23,42,0.3)] dark:shadow-[0_25px_60px_rgba(0,0,0,0.6)]"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-1"
                  >
                    <h3 className="text-2xl font-semibold tracking-tight text-text-primary">{name}</h3>
                    <ProfileCardTypewriter />
                  </motion.div>

                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-4 max-w-sm text-sm leading-relaxed text-text-secondary"
                  >
                    {blurb}
                  </motion.p>
                </div>

                {/* Social links */}
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: '-80px' }}
                  className="mt-6 flex w-full flex-col gap-3"
                >
                  {socialLinks.map((social) => {
                    const row = (
                      <>
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/10 bg-bg-surface text-text-secondary">
                            {social.icon}
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">{social.label}</p>
                            <p className="text-xs text-text-muted">{social.description}</p>
                          </div>
                        </div>
                        {social.href && (
                          <ArrowUpRight className="h-4 w-4 text-text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-cyan" />
                        )}
                      </>
                    )

                    if (!social.href) {
                      return (
                        <motion.div
                          key={social.label}
                          variants={itemVariants}
                          className="flex cursor-default items-center justify-between rounded-2xl border border-foreground/10 bg-bg-surface/40 px-4 py-3 text-left opacity-60"
                        >
                          {row}
                        </motion.div>
                      )
                    }

                    return (
                      <motion.a
                        key={social.label}
                        variants={itemVariants}
                        href={social.href}
                        target={social.isEmail ? undefined : '_blank'}
                        rel={social.isEmail ? undefined : 'noopener noreferrer'}
                        className="group flex items-center justify-between rounded-2xl border border-foreground/10 bg-bg-surface/70 px-4 py-3 text-left transition-all hover:-translate-y-0.5 hover:border-accent-cyan/30 hover:bg-bg-elevated"
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.985 }}
                      >
                        {row}
                      </motion.a>
                    )
                  })}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
