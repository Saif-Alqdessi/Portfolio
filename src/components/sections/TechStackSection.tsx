import { createClient } from '@/lib/supabase/server'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { GlassCard } from '@/components/ui/GlassCard'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import type { Database } from '@/lib/supabase/types'

type SkillRow = Database['public']['Tables']['skills']['Row']

const normalizeItems = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.filter(Boolean).map(String)
  if (typeof v === 'string') {
    const s = v.trim()
    if (!s) return []
    try {
      const parsed = JSON.parse(s)
      return Array.isArray(parsed) ? parsed.filter(Boolean).map(String) : []
    } catch {
      // if it's a comma-separated string fallback:
      return s.split(',').map(x => x.trim()).filter(Boolean)
    }
  }
  return []
}

interface SkillCategory {
  name: string
  color: 'cyan' | 'purple'
  items: string[]
  sort_order: number
}

const FALLBACK_CATEGORIES: SkillCategory[] = [
  {
    name: 'AI & Machine Learning',
    color: 'cyan',
    items: ['Python', 'PyTorch', 'TensorFlow', 'LangChain', 'LangGraph', 'Hugging Face', 'OpenAI API', 'Anthropic Claude'],
    sort_order: 0
  },
  {
    name: 'Backend & APIs',
    color: 'purple',
    items: ['FastAPI', 'Node.js', 'Express', 'PostgreSQL', 'Supabase', 'Redis', 'WebSockets', 'REST APIs'],
    sort_order: 1
  },
  {
    name: 'Frontend & UI',
    color: 'cyan',
    items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Vercel', 'Responsive Design'],
    sort_order: 2
  },
  {
    name: 'Data & Analytics',
    color: 'purple',
    items: ['Pandas', 'NumPy', 'SQL', 'Data Pipelines', 'ETL', 'Jupyter', 'Matplotlib', 'Seaborn'],
    sort_order: 3
  },
  {
    name: 'DevOps & Tools',
    color: 'cyan',
    items: ['Git', 'Docker', 'Linux', 'AWS', 'CI/CD', 'Monitoring', 'Testing', 'Deployment'],
    sort_order: 4
  },
  {
    name: 'Automation & Integration',
    color: 'purple',
    items: ['n8n', 'Zapier', 'Workflow Automation', 'API Integration', 'Webhooks', 'Cron Jobs', 'Event-Driven Architecture'],
    sort_order: 5
  }
]

export async function TechStackSection() {
  let categories: SkillCategory[] = FALLBACK_CATEGORIES

  try {
    const supabase = await createClient()
    const { data } = await (supabase
      .from('skills') as any)
      .select('category, items, sort_order')
      .order('sort_order')
    
    const skillRows = data as SkillRow[] | null
    if (skillRows && skillRows.length > 0) {
      categories = skillRows.map((skill, i) => ({
        name: skill.category,
        color: (i % 2 === 0 ? 'cyan' : 'purple') as 'cyan' | 'purple',
        items: normalizeItems(skill.items),
        sort_order: skill.sort_order
      }))
    }
  } catch {
    // fallback active
  }

  return (
    <section id="stack" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        
        <ScrollReveal direction="up">
          <SectionHeader
            label="Technologies"
            title="Tech Stack"
            subtitle="Tools and technologies I use to build intelligent systems"
            align="center"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, i) => (
            <ScrollReveal key={category.name} delay={i * 80}>
              <GlassCard variant="default" className="h-full">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h3 className={`font-semibold text-base ${
                      category.color === 'cyan' ? 'text-accent-cyan' : 'text-accent-purple'
                    }`}>
                      {category.name}
                    </h3>
                    <div className={`h-0.5 w-12 rounded-full ${
                      category.color === 'cyan' ? 'bg-accent-cyan' : 'bg-accent-purple'
                    }`} />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    {category.items.map((item) => (
                      <div
                        key={item}
                        className="text-text-secondary text-sm py-1.5 px-2 rounded-lg bg-bg-surface/60 border border-white/5 hover:border-white/10 transition-colors"
                      >
                        {item}
                      </div>
                    ))}
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
