import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { CTAButton } from '@/components/ui/CTAButton'
import { TechChip } from '@/components/ui/TechChip'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { Github, ExternalLink, Folder } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

type ProjectRow = Database['public']['Tables']['projects']['Row'] & {
  project_tech_tags: { name: string; sort_order: number }[]
}

const FALLBACK: ProjectRow[] = [
  { id: '1', title: 'Smart Event System',           description: 'AI-based real-time face recognition and automated photo sorting for large-scale events, reducing manual processing time by 95%.',   project_tech_tags: [{name: 'Python', sort_order: 0},{name: 'InsightFace', sort_order: 1},{name: 'OpenCV', sort_order: 2}],  image_url: null, github_url: null, live_url: null, featured: true,  sort_order: 0, created_at: '2024-01-01T00:00:00Z' },
  { id: '2', title: 'Customer Churn Prediction',    description: 'Classification models to predict customer churn and extract actionable insights for retention strategies.',                         project_tech_tags: [{name: 'Python', sort_order: 0},{name: 'SQL', sort_order: 1},{name: 'XGBoost', sort_order: 2}],         image_url: null, github_url: null, live_url: null, featured: true,  sort_order: 1, created_at: '2024-01-02T00:00:00Z' },
  { id: '3', title: 'Leaf Disease Recognition CNN', description: 'CNN-based system achieving high accuracy in classifying plant health conditions and suggesting treatments.',                        project_tech_tags: [{name: 'Python', sort_order: 0},{name: 'TensorFlow', sort_order: 1},{name: 'Keras', sort_order: 2}],    image_url: null, github_url: null, live_url: null, featured: false, sort_order: 2, created_at: '2024-01-03T00:00:00Z' },
  { id: '4', title: 'Weather Data Pipeline',        description: 'Automated pipeline to fetch, process, and visualise real-time data for local activity planning.',                          project_tech_tags: [{name: 'Python', sort_order: 0},{name: 'REST APIs', sort_order: 1},{name: 'SQL', sort_order: 2}],       image_url: null, github_url: null, live_url: null, featured: false, sort_order: 3, created_at: '2024-01-04T00:00:00Z' },
]

const GRADIENTS = [
  'from-accent-cyan/20 via-bg-elevated to-accent-purple/20',
  'from-accent-purple/20 via-bg-elevated to-accent-cyan/15',
  'from-accent-cyan/15 via-bg-surface to-bg-elevated',
  'from-accent-purple/15 via-bg-surface to-accent-cyan/10',
]

export async function ProjectsSection() {
  let projects: ProjectRow[] = FALLBACK
  try {
    const supabase = await createClient()
    const { data } = await (supabase.from('projects') as any)
      .select('id,title,description,image_url,github_url,live_url,featured,sort_order,project_tech_tags(name,sort_order)')
      .order('sort_order', { ascending: true })
    const projectRows = data as ProjectRow[] | null
    if (projectRows && projectRows.length > 0) {
      projects = projectRows.map(p => ({
        ...p,
        project_tech_tags: (p.project_tech_tags || []).sort((a, b) => a.sort_order - b.sort_order)
      }))
    }
  } catch { /* fallback */ }

  return (
    <section id="projects" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 space-y-14">
        <ScrollReveal direction="up">
          <SectionHeader label="Portfolio" title="Projects"
            subtitle="Selected work across AI systems, ML models, and data engineering."
            align="left" />
        </ScrollReveal>

        <div className="space-y-5">
          {projects.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 80}>
              <GlassCard variant={p.featured ? 'active' : 'default'}
                className="overflow-hidden !p-0 hover:-translate-y-0.5 transition-transform duration-300">
                <div className="flex flex-col md:flex-row">
                  {/* Image / placeholder */}
                  <div className={`relative md:w-[38%] h-52 md:h-auto flex-shrink-0 bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} flex items-center justify-center`}>
                    {p.image_url
                      ? <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                      : <Folder size={40} strokeWidth={1} className="text-white/15" />}
                    {p.featured && (
                      <span className="absolute top-3 left-3 text-[10px] font-mono font-semibold tracking-widest uppercase px-2 py-1 rounded bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/30">
                        Featured
                      </span>
                    )}
                  </div>
                  {/* Content */}
                  <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-5">
                    <div className="space-y-3">
                      <h3 className="text-text-primary font-bold text-lg sm:text-xl">{p.title}</h3>
                      <p className="text-text-secondary text-sm sm:text-base leading-relaxed">{p.description}</p>
                    </div>
                    <div className="space-y-4">
                      {p.project_tech_tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {p.project_tech_tags.map((t) => <TechChip key={t.name} label={t.name} />)}
                        </div>
                      )}
                      {(p.github_url || p.live_url) && (
                        <div className="flex gap-3">
                          {p.github_url && <CTAButton variant="outline" href={p.github_url} target="_blank" rel="noreferrer" size="sm"><Github size={14} />GitHub</CTAButton>}
                          {p.live_url  && <CTAButton variant="ghost"   href={p.live_url}   target="_blank" rel="noreferrer" size="sm"><ExternalLink size={14} />Live</CTAButton>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
