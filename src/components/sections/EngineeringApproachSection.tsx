import { createClient } from '@/lib/supabase/server'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeonIcon } from '@/components/ui/NeonIcon'
import { StepBadge } from '@/components/ui/StepBadge'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { cn } from '@/lib/utils'
import { Database, BrainCircuit, Gauge, Server, TrendingUp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Database as SupabaseDatabase } from '@/lib/supabase/types'

type ApproachRow = SupabaseDatabase['public']['Tables']['approach']['Row']

const STEP_ICONS: Record<number, LucideIcon> = {
  1: Database, 2: BrainCircuit, 3: Gauge, 4: Server, 5: TrendingUp,
}


const FALLBACK: ApproachRow[] = [
  { id: '1', step_number: 1, title: 'Data',         description: 'Identify, collect, and clean the data that drives the system.',                          is_active: false, sort_order: 0 },
  { id: '2', step_number: 2, title: 'Modeling',     description: 'Select architecture, train models, and iterate with precision.',                         is_active: true,  sort_order: 1 },
  { id: '3', step_number: 3, title: 'Evaluation',   description: 'Benchmark rigorously against real-world metrics and edge cases.',                        is_active: false, sort_order: 2 },
  { id: '4', step_number: 4, title: 'Deployment',   description: 'Ship to production with monitoring, logging, and failover in place.',                    is_active: false, sort_order: 3 },
  { id: '5', step_number: 5, title: 'Optimisation', description: 'Continuously improve latency, accuracy, and cost through feedback loops.',               is_active: false, sort_order: 4 },
]

export async function EngineeringApproachSection() {
  let steps: ApproachRow[] = FALLBACK
  try {
    const supabase = await createClient()
    const { data } = await (supabase.from('approach') as any)
      .select('step_number,title,description,is_active,sort_order')
      .order('sort_order')
    const approachRows = data as ApproachRow[] | null
    if (approachRows && approachRows.length > 0) steps = approachRows
  } catch { /* fallback */ }

  return (
    <section id="approach" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 space-y-16">

        <ScrollReveal direction="up">
          <SectionHeader
            label="Methodology"
            title="Engineering Approach"
            subtitle="Systematic methodology for building production AI systems"
            align="center"
          />
        </ScrollReveal>

        <div className="relative">
          {/* Connector line — desktop only, sits behind step badges */}
          <div className="hidden lg:block absolute top-5 left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-accent-cyan/25 to-transparent pointer-events-none" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {steps.map((step, i) => {
              const Icon = STEP_ICONS[step.step_number] ?? BrainCircuit
              const active = step.is_active
              return (
                <ScrollReveal key={step.step_number} delay={i * 90}>
                  <div className="relative pt-6">
                    {/* Badge centred above card */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                      <StepBadge step={step.step_number} active={active} />
                    </div>
                    <GlassCard
                      variant={active ? 'active' : 'default'}
                      className={cn(
                        'h-full flex flex-col items-center text-center gap-4 pt-10 pb-6 px-4',
                        active && 'shadow-glow-cyan'
                      )}
                    >
                      <NeonIcon icon={Icon} size="md" color={active ? 'cyan' : 'purple'} />
                      <div className="space-y-2">
                        <h3 className={cn('font-semibold text-sm', active ? 'text-accent-cyan' : 'text-text-primary')}>
                          {step.title}
                        </h3>
                        <p className="text-text-muted text-xs leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </GlassCard>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>

      </div>
    </section>
  )
}
