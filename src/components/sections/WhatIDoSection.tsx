import { createClient } from '@/lib/supabase/server'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeonIcon } from '@/components/ui/NeonIcon'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Bot, Server, BrainCircuit, Database, Workflow, BarChart2, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Database as SupabaseDatabase } from '@/lib/supabase/types'

type ServiceRow = SupabaseDatabase['public']['Tables']['services']['Row']

const ICON_MAP: Record<string, LucideIcon> = {
  Bot, Server, BrainCircuit, Database, Workflow, BarChart2, Zap,
}


const FALLBACK_SERVICES: ServiceRow[] = [
  { id: '1', title: 'Agentic AI Systems',      description: 'Design and build multi-agent systems with LangGraph and LangChain that handle complex autonomous tasks end-to-end.',          icon: 'Bot',          sort_order: 0 },
  { id: '2', title: 'AI Backend Engineering',  description: 'FastAPI-based async backends with real-time WebSocket support, RESTful API design, and middleware security.',                  icon: 'Server',       sort_order: 1 },
  { id: '3', title: 'ML Model Development',    description: 'Train, fine-tune, and evaluate deep learning models using PyTorch and TensorFlow for classification and prediction tasks.',    icon: 'BrainCircuit', sort_order: 2 },
  { id: '4', title: 'RAG & Knowledge Systems', description: 'Build retrieval-augmented generation pipelines optimised for accuracy, latency, and domain-specific grounding.',               icon: 'Database',     sort_order: 3 },
  { id: '5', title: 'Workflow Automation',     description: 'Automate business processes with n8n and custom API integrations, replacing manual operations with scalable AI workflows.',    icon: 'Workflow',     sort_order: 4 },
  { id: '6', title: 'Data Engineering',        description: 'Design pipelines to fetch, process, and visualise real-time data, turning raw inputs into actionable intelligence.',           icon: 'BarChart2',    sort_order: 5 },
]

const CARD_COLORS: ('cyan' | 'purple')[] = ['cyan', 'purple', 'cyan', 'purple', 'cyan', 'purple']

export async function WhatIDoSection() {
  let services: ServiceRow[] = FALLBACK_SERVICES

  try {
    const supabase = await createClient()
    const { data } = await (supabase
      .from('services') as any)
      .select('title, description, icon, sort_order')
      .order('sort_order')
    const serviceRows = data as ServiceRow[] | null
    if (serviceRows && serviceRows.length > 0) services = serviceRows
  } catch {
    // fallbacks active
  }

  return (
    <section id="what-i-do" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 space-y-16">

        <ScrollReveal direction="up">
          <SectionHeader
            label="Capabilities"
            title="What I Do"
            subtitle="Specialized expertise in cutting-edge AI & ML systems"
            align="center"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((svc, i) => {
            const ResolvedIcon = ICON_MAP[svc.icon] ?? Bot
            const color = CARD_COLORS[i % CARD_COLORS.length]
            return (
              <ScrollReveal key={svc.title} delay={i * 75}>
                <GlassCard
                  variant="default"
                  className="h-full flex flex-col gap-4 hover:-translate-y-1 transition-transform duration-300"
                >
                  <NeonIcon icon={ResolvedIcon} size="md" color={color} />
                  <div className="space-y-2">
                    <h3 className="text-text-primary font-semibold text-base">
                      {svc.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {svc.description}
                    </p>
                  </div>
                </GlassCard>
              </ScrollReveal>
            )
          })}
        </div>

      </div>
    </section>
  )
}
