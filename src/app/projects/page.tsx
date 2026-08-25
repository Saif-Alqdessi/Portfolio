import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Code2, ExternalLink } from 'lucide-react'
import { QuordixWorkHero } from '@/components/ui/quordix-work-hero'
import { WorkflowBuilderCard } from '@/components/ui/workflow-builder-card'
import type { Database } from '@/lib/supabase/types'

type ProjectRow = Database['public']['Tables']['projects']['Row'] & {
  project_tech_tags: { name: string; sort_order: number }[]
}

// Mirrors the four real projects in Supabase, so a failed query degrades to
// accurate content rather than an older, unrelated project list.
const FALLBACK: ProjectRow[] = [
  { id: '1', title: 'EventFlow AI',                      description: 'Sorts thousands of event photos by the people in them. RetinaFace detects faces, ArcFace turns them into identity embeddings, and GFPGAN restores low-quality crops before matching. The pipeline runs on CUDA for throughput, with a Next.js dashboard where organisers pull every shot of a given person.', project_tech_tags: [{name: 'CUDA', sort_order: 0},{name: 'RetinaFace', sort_order: 1},{name: 'ArcFace', sort_order: 2},{name: 'Next.js', sort_order: 3}], image_url: null, github_url: 'https://github.com/Saif-Alqdessi/AI-Smart-Event-Photo-Sorter', live_url: null, featured: true,  sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', title: 'Agentic HR Interviewer',            description: "Runs voice interviews with candidates and checks what they say while they say it. A LangGraph agent graph keeps the interviewer in persona while a second agent verifies claims against the candidate's history in Supabase. Audio streams over WebSockets with ElevenLabs for speech, on an async FastAPI backend.", project_tech_tags: [{name: 'LangGraph', sort_order: 0},{name: 'FastAPI', sort_order: 1},{name: 'WebSockets', sort_order: 2},{name: 'ElevenLabs', sort_order: 3}], image_url: null, github_url: 'https://github.com/Saif-Alqdessi/Agentic-HR-Interviewer', live_url: null, featured: true,  sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
  { id: '3', title: 'Financial Portfolio Manager',       description: 'Tracks investment portfolios, shared investor accounts, and debt repayments in one place. Balances and returns recalculate as entries change, and the whole interface runs in two languages. Built on Next.js and TypeScript over a Postgres schema in Supabase.', project_tech_tags: [{name: 'Next.js', sort_order: 0},{name: 'Supabase', sort_order: 1},{name: 'PostgreSQL', sort_order: 2},{name: 'TypeScript', sort_order: 3}], image_url: null, github_url: 'https://github.com/Saif-Alqdessi/Investment-Debt-Management-System', live_url: null, featured: false, sort_order: 2, created_at: '2024-01-03T00:00:00Z' },
  { id: '4', title: 'Automated Ticketing & Verification', description: 'Handles ticketing for large events: bulk email sends, a QR code generated per attendee, and a dashboard to manage the guest list. Tickets are linked from cloud storage rather than attached, which keeps message payloads small enough to send reliably from a low-resource server.', project_tech_tags: [{name: 'FastAPI', sort_order: 0},{name: 'Next.js', sort_order: 1},{name: 'Supabase', sort_order: 2},{name: 'QR Logic', sort_order: 3}], image_url: null, github_url: null, live_url: null, featured: false, sort_order: 3, created_at: '2024-01-04T00:00:00Z' },
]

// Real project screenshots aren't uploaded for every project yet — these are
// stable, well-known Unsplash tech photos used only as a visual placeholder
// when a project has no image_url of its own.
const UNSPLASH_FALLBACKS = [
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop',
]

function formatMonthYear(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

export const metadata: Metadata = {
  title: 'Projects – Saif Alqdessi',
  description: 'Selected AI systems, agents, and automation tools designed and shipped by Saif Alqdessi.',
}

export default async function ProjectsPage() {
  let projects: ProjectRow[] = FALLBACK

  try {
    const supabase = await createClient()
    const { data } = await (supabase.from('projects') as any)
      .select('id,title,description,image_url,github_url,live_url,featured,sort_order,created_at,project_tech_tags(name,sort_order)')
      .order('sort_order', { ascending: true })
    const projectRows = data as ProjectRow[] | null
    if (projectRows && projectRows.length > 0) {
      projects = projectRows.map((p) => ({
        ...p,
        project_tech_tags: (p.project_tech_tags || []).sort((a, b) => a.sort_order - b.sort_order),
      }))
    }
  } catch {
    // fallback active
  }

  return (
    <div className="bg-background">
      <QuordixWorkHero />

      <section className="max-w-7xl mx-auto px-6 py-20 bg-background">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p, i) => (
            <WorkflowBuilderCard
              key={p.id}
              imageUrl={p.image_url || UNSPLASH_FALLBACKS[i % UNSPLASH_FALLBACKS.length]}
              status="Active"
              lastUpdated={formatMonthYear(p.created_at)}
              title={p.title}
              description={p.description}
              tags={p.project_tech_tags.map((t) => t.name)}
              users={[{ src: '/img/Saif.jpg', fallback: 'SA' }]}
              actions={[
                ...(p.github_url
                  ? [{ icon: <Code2 size={14} />, bgColor: 'bg-slate-800', href: p.github_url, label: 'View source on GitHub' }]
                  : []),
                ...(p.live_url
                  ? [{ icon: <ExternalLink size={14} />, bgColor: 'bg-orange-500', href: p.live_url, label: 'View live project' }]
                  : []),
              ]}
              className="mx-auto w-full max-w-none"
            />
          ))}
        </div>
      </section>
    </div>
  )
}
