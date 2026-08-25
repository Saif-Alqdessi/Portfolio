import { createClient } from '@/lib/supabase/server'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { MorphingCardStack } from '@/components/ui/morphing-card-stack'
import { Bot, Server, BrainCircuit, Database, Workflow, BarChart2, Zap, Eye, Globe } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { Database as SupabaseDatabase } from '@/lib/supabase/types'

type ServiceRow = SupabaseDatabase['public']['Tables']['services']['Row']

// Keys must match the `icon` column in Supabase. An unmapped name silently
// falls back to Bot, so add the icon here when adding a service that uses it.
const ICON_MAP: Record<string, LucideIcon> = {
  Bot, Server, BrainCircuit, Database, Workflow, BarChart2, Zap, Eye, Globe,
}

const FALLBACK_SERVICES: ServiceRow[] = [
  { id: '1', title: 'Multi-Agent Systems',          description: 'An agent that plans its own steps, calls tools, and knows when it is done. I build the graph, the tool definitions, and the fallbacks for when a step fails or a model returns nonsense.',                        tech: ['LangGraph', 'LangChain', 'Tool Calling', 'Python'],          icon: 'Bot',          sort_order: 0 },
  { id: '2', title: 'Backends & APIs',              description: 'The service layer underneath the model: streaming endpoints for anything that updates live, auth and middleware, and enough queueing that one slow inference call does not block every other request.',           tech: ['FastAPI', 'WebSockets', 'Async Python', 'REST'],             icon: 'Server',       sort_order: 1 },
  { id: '3', title: 'Model Training & Fine-Tuning', description: 'Training and fine-tuning on your data, plus the evaluation harness that tells you whether the new checkpoint is genuinely better than the one already in production.',                                            tech: ['PyTorch', 'TensorFlow', 'Scikit-learn', 'XGBoost'],          icon: 'BrainCircuit', sort_order: 2 },
  { id: '4', title: 'RAG & Retrieval Pipelines',    description: 'Chunking, embedding, and retrieval over your own documents so answers point at something real. Including the part most demos skip: what the system does when nothing relevant comes back.',                       tech: ['LangChain', 'Embeddings', 'Vector Search', 'PostgreSQL'],    icon: 'Database',     sort_order: 3 },
  { id: '5', title: 'Workflow Automation',          description: "Connecting the tools a business already runs on, so the copy-paste steps between them stop being someone's job. Usually n8n where it fits, custom integrations where it does not.",                               tech: ['n8n', 'REST APIs', 'Webhooks', 'Python'],                    icon: 'Workflow',     sort_order: 4 },
  { id: '6', title: 'Data Pipelines',               description: 'Scheduled jobs that pull from APIs and databases, reconcile the messy parts, and land clean rows somewhere you can actually query and chart.',                                                                    tech: ['Python', 'SQL', 'Supabase', 'REST APIs'],                     icon: 'BarChart2',    sort_order: 5 },
  { id: '7', title: 'Computer Vision',              description: 'Detection, recognition, and matching on real photographs rather than benchmark sets. That means the blurry frames, the faces turned half away from the camera, and the near-duplicates a naive similarity threshold will happily merge into one person. I tune the threshold against your data, because the right cutoff for a wedding album is not the right cutoff for a door lock.', tech: ['RetinaFace', 'ArcFace', 'OpenCV', 'CUDA'],                    icon: 'Eye',          sort_order: 6 },
  { id: '8', title: 'Web Applications',             description: "Full-stack apps where the schema and the interface get designed together: typed from the database through to the component, server-rendered, with row-level security so one account cannot read another's rows. Includes the unglamorous parts that decide whether it survives real users, like auth, migrations, and running the whole interface in a second language.",              tech: ['Next.js', 'TypeScript', 'Supabase', 'Tailwind CSS'],         icon: 'Globe',        sort_order: 7 },
]

export async function WhatIDoSection() {
  let services: ServiceRow[] = FALLBACK_SERVICES

  try {
    const supabase = await createClient()
    const { data } = await (supabase
      .from('services') as any)
      .select('id, title, description, icon, tech, sort_order')
      .order('sort_order')
    const serviceRows = data as ServiceRow[] | null
    if (serviceRows && serviceRows.length > 0) services = serviceRows
  } catch {
    // fallbacks active
  }

  const cards = services.map((svc) => {
    const Icon = ICON_MAP[svc.icon] ?? Bot
    return {
      id: svc.id,
      title: svc.title,
      description: svc.description,
      tech: svc.tech ?? [],
      icon: <Icon className="h-5 w-5" strokeWidth={1.5} />,
    }
  })

  return (
    <section id="what-i-do" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 space-y-16">

        <ScrollReveal direction="up">
          <SectionHeader
            label="Services"
            title="What I Do"
            subtitle="The kinds of systems I design, build, and put into production."
            align="center"
          />
        </ScrollReveal>

        <ScrollReveal direction="up" delay={100}>
          <MorphingCardStack cards={cards} defaultLayout="stack" className="mt-12 max-w-4xl mx-auto" />
        </ScrollReveal>

      </div>
    </section>
  )
}
