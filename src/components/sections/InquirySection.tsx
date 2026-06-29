'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, Check, ChevronDown, Loader2, Send, Clock, Zap, ClipboardList, DollarSign } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { NeonIcon } from '@/components/ui/NeonIcon'
import { SelectChip } from '@/components/ui/SelectChip'
import { ScrollReveal } from '@/components/ui/ScrollReveal'

const inputCls =
  'w-full px-3 py-2.5 rounded-lg bg-bg-surface/80 border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-text-muted'
const labelCls = 'block text-xs font-medium text-text-secondary mb-1.5'

const SERVICES = ['AI Agents', 'n8n Workflows', 'RAG Systems', 'AI Systems', 'Smart Websites', 'Automations']
const TIMELINES = ['ASAP', '1-3 months', '3-6 months', 'Exploring']
const BUDGETS = ['Under $1K', '$1K - $5K', '$5K - $10K', '$10K+']
const ROLES = ['Owner', 'Manager', 'Operations', 'Technical', 'Sales', 'Marketing']

const EXPECTATIONS: { icon: LucideIcon; text: string }[] = [
  { icon: Clock,          text: 'Free 30-minute consultation' },
  { icon: Zap,            text: 'Response within 24 hours' },
  { icon: ClipboardList,  text: 'No-obligation project scoping' },
  { icon: DollarSign,     text: 'Transparent pricing upfront' },
]

export function InquirySection() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [role, setRole] = useState('')
  const [services, setServices] = useState<string[]>([])
  const [timeline, setTimeline] = useState('')
  const [challenge, setChallenge] = useState('')
  const [budget, setBudget] = useState('')

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // 7 clean checkpoints (optional website excluded)
  const steps = [name, email, phone, role, services.length > 0 ? 'x' : '', challenge, budget]
  const completed = steps.filter(Boolean).length
  const total = steps.length
  const progress = Math.round((completed / total) * 100)

  function toggleService(s: string) {
    setServices(prev => (prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]))
  }

  const canSubmit = useMemo(
    () => Boolean(name.trim() && email.trim() && role && services.length > 0 && challenge.trim() && budget),
    [name, email, role, services, challenge, budget]
  )

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')

    if (!canSubmit) {
      setError('Please complete the required fields before submitting.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, email, phone, website, role,
          services, timeline, challenge, budget,
        }),
      })

      if (!res.ok) {
        let serverMessage = 'Something went wrong. Please try again.'
        try {
          const data = await res.json()
          if (data?.error) serverMessage = data.error
        } catch {
          // response had no JSON body; keep the generic message
        }
        throw new Error(serverMessage)
      }

      setSubmitted(true)
    } catch (err: unknown) {
      console.error('Inquiry submission failed:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function resetForm() {
    setName(''); setEmail(''); setPhone(''); setWebsite(''); setRole('')
    setServices([]); setTimeline(''); setChallenge(''); setBudget('')
    setError(''); setSubmitted(false)
  }

  return (
    <section id="get-started" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 space-y-16">

        <ScrollReveal direction="up">
          <SectionHeader
            label="Get Started"
            title="Let's Talk About Your Project"
            subtitle="Tell us what you're building and we'll show you how AI can accelerate it."
            align="center"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT — context & progress */}
          <ScrollReveal direction="up" className="lg:col-span-5 space-y-6">
            <GlassCard variant="default" className="space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-semibold tracking-[0.2em] uppercase text-text-secondary">
                    Form Progress
                  </span>
                  <span className="font-mono text-sm text-accent-cyan">
                    {completed}<span className="text-text-muted">/{total}</span>
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-accent-cyan to-accent-purple shadow-glow-cyan transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard variant="default" className="space-y-4">
              <h3 className="text-text-primary font-semibold text-base">What to expect</h3>
              <ul className="space-y-3">
                {EXPECTATIONS.map(({ icon, text }) => (
                  <li key={text} className="flex items-center gap-3">
                    <NeonIcon icon={icon} size="sm" color="cyan" />
                    <span className="text-text-secondary text-sm">{text}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </ScrollReveal>

          {/* RIGHT — the form */}
          <ScrollReveal direction="up" delay={120} className="lg:col-span-7">
            <GlassCard variant="default" className="p-6 sm:p-8">
              {submitted ? (
                <div className="flex flex-col items-center text-center gap-4 py-10">
                  <NeonIcon icon={CheckCircle2} size="md" color="cyan" />
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-text-primary">Inquiry received</h3>
                    <p className="text-text-secondary text-sm max-w-sm leading-relaxed">
                      {name.trim() ? `Thanks, ${name.split(' ')[0]}. ` : ''}We&apos;ll review your project
                      details and respond within 24 hours.
                    </p>
                  </div>
                  <CTAButton variant="outline" onClick={resetForm} className="mt-2">
                    Send another inquiry
                  </CTAButton>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                  {/* Row 1 — name + email */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name *</label>
                      <input
                        name="name" required value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="Jane Doe" className={inputCls}
                      />
                    </div>
                    <div>
                      <label className={labelCls}>Business Email *</label>
                      <input
                        name="email" type="email" required value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="jane@company.com" className={inputCls}
                      />
                    </div>
                  </div>

                  {/* Row 2 — phone */}
                  <div>
                    <label className={labelCls}>Phone Number</label>
                    <input
                      name="phone" type="tel" value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000" className={inputCls}
                    />
                    <p className="mt-1 text-xs text-text-muted">Include country code (e.g. +1, +44).</p>
                  </div>

                  {/* Row 3 — website */}
                  <div>
                    <label className={labelCls}>Website URL <span className="text-text-muted">(optional)</span></label>
                    <input
                      name="website" type="url" value={website}
                      onChange={e => setWebsite(e.target.value)}
                      placeholder="https://yourcompany.com" className={inputCls}
                    />
                  </div>

                  {/* Row 4 — role dropdown */}
                  <div>
                    <label className={labelCls}>Job Title / Company Role *</label>
                    <div className="relative">
                      <select
                        name="role" required value={role}
                        onChange={e => setRole(e.target.value)}
                        className={`${inputCls} appearance-none pr-10 ${role ? '' : 'text-text-muted'}`}
                      >
                        <option value="" disabled>Select your role</option>
                        {ROLES.map(r => <option key={r} value={r} className="text-text-primary bg-bg-surface">{r}</option>)}
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted" />
                    </div>
                  </div>

                  {/* Row 5 — services (multi) */}
                  <div>
                    <label className={labelCls}>Services of Interest *</label>
                    <div className="flex flex-wrap gap-2">
                      {SERVICES.map(s => (
                        <SelectChip
                          key={s} label={s}
                          selected={services.includes(s)}
                          onClick={() => toggleService(s)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Row 6 — timeline (single) */}
                  <div>
                    <label className={labelCls}>Project Timeline</label>
                    <div className="flex flex-wrap gap-2">
                      {TIMELINES.map(t => (
                        <SelectChip
                          key={t} label={t}
                          selected={timeline === t}
                          onClick={() => setTimeline(prev => (prev === t ? '' : t))}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Row 7 — challenge */}
                  <div>
                    <label className={labelCls}>Primary Business Challenge *</label>
                    <textarea
                      name="challenge" required rows={4} value={challenge}
                      onChange={e => setChallenge(e.target.value)}
                      placeholder="Describe the problem you're trying to solve…"
                      className={`${inputCls} resize-none`}
                    />
                  </div>

                  {/* Row 8 — budget (single) */}
                  <div>
                    <label className={labelCls}>Estimated Budget</label>
                    <div className="flex flex-wrap gap-2">
                      {BUDGETS.map(b => (
                        <SelectChip
                          key={b} label={b}
                          selected={budget === b}
                          onClick={() => setBudget(prev => (prev === b ? '' : b))}
                        />
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
                      {error}
                    </p>
                  )}

                  <CTAButton
                    type="submit" variant="primary" size="lg"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <><Loader2 size={18} className="animate-spin" /> Sending…</>
                    ) : (
                      <>Book Your Free Consultation <Send size={18} /></>
                    )}
                  </CTAButton>
                </form>
              )}
            </GlassCard>
          </ScrollReveal>

        </div>
      </div>
    </section>
  )
}
