import { createClient } from '@/lib/supabase/server'
import { Brain, Download, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import type { Database } from '@/lib/supabase/types'
import { HeroRoles } from './HeroRoles'

type TitleRow = Database['public']['Tables']['titles']['Row']
type ProfileRow = Database['public']['Tables']['profile']['Row']

const FALLBACK_TITLES = [
  'AI Systems Engineer',
  'Agent Engineer',
  'ML Engineer',
  'RAG & LLM Apps',
  'Automation & Workflows',
]
const FALLBACK_BIO =
  'Building autonomous AI solutions, intelligent agents, and scalable architectures that transform how businesses operate.'

export async function HeroSection() {
  let titles = FALLBACK_TITLES
  let bio = FALLBACK_BIO

  try {
    const supabase = await createClient()
    const [titlesRes, profileRes] = await Promise.all([
      (supabase.from('titles') as any).select('title').order('sort_order'),
      (supabase.from('profile') as any).select('summary').single(),
    ])
    const titleRows = titlesRes.data as TitleRow[] | null
    const profile = profileRes.data as ProfileRow | null

    if (titleRows && titleRows.length > 0) {
      titles = titleRows.map((t) => t.title)
    }
    if (profile?.summary) {
      bio = profile.summary
    }
  } catch {
    // fallbacks active
  }

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-3xl mx-auto animate-fade-up space-y-8">

        {/* Top icon badge */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow */}
          <div
            className="absolute w-24 h-24 rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(6,182,212,0.30) 0%, transparent 70%)',
              filter: 'blur(14px)',
            }}
          />
          <div className="relative w-16 h-16 rounded-full flex items-center justify-center border border-accent-cyan/30 bg-bg-surface/80 backdrop-blur-md">
            <Brain size={30} className="text-accent-cyan" strokeWidth={1.5} />
          </div>
        </div>

        {/* Main heading */}
        <div className="space-y-5">
          <h1
            className="font-bold leading-tight tracking-tight"
            style={{
              fontSize: 'clamp(2.8rem, 8vw, 5rem)',
              background: 'linear-gradient(135deg, #f8fafc 30%, #22d3ee 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 28px rgba(6,182,212,0.30))',
            }}
          >
            Hi, I&apos;m Saif
          </h1>

          {/* Animated roles */}
          <HeroRoles roles={titles} />
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl">
          {bio}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          {/* Primary — cyan glow */}
          <a
            href="/cv.pdf"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-bg-base transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
              boxShadow: '0 0 24px rgba(6,182,212,0.40), 0 4px 16px rgba(0,0,0,0.4)',
            }}
          >
            <Download size={15} />
            Download CV
          </a>

          {/* Secondary — glass */}
          <Link
            href="#contact"
            className="group inline-flex items-center gap-2 px-7 py-3 rounded-xl font-semibold text-sm text-text-secondary border border-white/10 bg-white/5 backdrop-blur-md transition-all duration-200 hover:bg-white/10 hover:text-text-primary hover:border-accent-cyan/30 hover:scale-105 active:scale-95"
          >
            Contact Me
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30 hover:opacity-60 transition-opacity">
        <span className="text-[10px] font-mono text-text-muted tracking-[0.3em] uppercase">Scroll</span>
        <div className="w-px h-8 bg-gradient-to-b from-accent-cyan/60 to-transparent" />
      </div>
    </section>
  )
}
