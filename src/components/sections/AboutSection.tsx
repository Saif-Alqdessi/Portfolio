import { createClient } from '@/lib/supabase/server'
import { ProfileCircle } from '@/components/ui/ProfileCircle'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { BrainCircuit, Users, Award, Quote } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

type ProfileRow = Database['public']['Tables']['profile']['Row']

const FALLBACK_SUMMARY =
  'AI Systems & Agent Engineer focused on transforming operational bottlenecks into autonomous end-to-end AI solutions. Expert in designing intelligent agents, real-time web integrations, and automated workflows that replace manual processes with scalable AI architectures.'

const FEATURE_TAGS = [
  { label: 'AI Systems Architect',    Icon: BrainCircuit, color: 'cyan'   as const },
  { label: 'Agent Engineer',    Icon: Users,        color: 'purple' as const },
  { label: 'Community Leader', Icon: Award,        color: 'cyan'   as const },
]

export async function AboutSection() {
  let summary = FALLBACK_SUMMARY

  try {
    const supabase = await createClient()
    const { data } = await (supabase
      .from('profile') as any)
      .select('summary')
      .single()
    const profile = data as ProfileRow | null
    if (profile?.summary) summary = profile.summary
  } catch {
    // fallback active
  }

  return (
    <section id="about" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 space-y-16">

        {/* Header */}
        <ScrollReveal direction="up" className="text-center space-y-2">
          <span className="text-xs font-mono text-accent-cyan tracking-[0.25em] uppercase">
            Who I Am
          </span>
          <h2 className="text-section font-bold text-text-primary">About Me</h2>
        </ScrollReveal>

        {/* Split layout */}
        <div className="grid lg:grid-cols-[2fr_3fr] gap-14 xl:gap-20 items-center">

          {/* ── Left: portrait ── */}
          <ScrollReveal delay={100} className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-[-48px] rounded-full border border-accent-cyan/5" />
              <div className="absolute inset-[-90px] rounded-full border border-accent-purple/4" />
              <ProfileCircle src="/img/Saif.jpg" alt="Saif Alqdessi" size={260} />
            </div>
          </ScrollReveal>

          {/* ── Right: text ── */}
          <ScrollReveal delay={200} className="space-y-6">
            <h3 className="text-xl sm:text-2xl font-semibold text-text-primary leading-snug">
              AI Engineer passionate about building{' '}
              <span className="text-accent-cyan">autonomous intelligent systems</span>
            </h3>

            <p className="text-text-secondary text-base leading-relaxed">
              {summary}
            </p>

            <p className="text-text-secondary text-base leading-relaxed">
              Beyond engineering, I&apos;ve led a 30-volunteer IEEE chapter, organized a
              300-participant conference with Ministry sponsorship, and was recognised as
              IEEE Region&nbsp;8 Best Ambassador 2023 — proof that I build people and
              communities, not just systems.
            </p>

            {/* Feature tags */}
            <div className="flex flex-wrap gap-3 pt-1">
              {FEATURE_TAGS.map(({ label, Icon, color }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/8 bg-bg-surface/60 text-sm text-text-secondary"
                >
                  <Icon
                    size={14}
                    className={color === 'cyan' ? 'text-accent-cyan' : 'text-accent-purple'}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="flex items-start gap-3 px-5 py-4 rounded-xl border-l-2 border-accent-cyan/60 bg-bg-surface/40 text-text-secondary italic text-sm">
              <Quote size={15} className="text-accent-cyan mt-0.5 flex-shrink-0" />
              <span>
                &ldquo;Turning data into decisions, and ideas into autonomous systems.&rdquo;
              </span>
            </blockquote>
          </ScrollReveal>

        </div>
      </div>
    </section>
  )
}
