import { createClient } from '@/lib/supabase/server'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { StatHighlightCards } from './StatHighlightCards'
import type { Database } from '@/lib/supabase/types'

type StatRow = Database['public']['Tables']['stats']['Row']

const FALLBACK_STATS: StatRow[] = [
  { id: '1', label: 'Projects Delivered',      value: 4,   prefix: '', suffix: '+', sort_order: 0 },
  { id: '2', label: 'Certifications',          value: 10,  prefix: '', suffix: '+', sort_order: 1 },
  { id: '3', label: 'Volunteers Led',          value: 30,  prefix: '', suffix: '+', sort_order: 2 },
  { id: '4', label: 'Conference Participants', value: 300, prefix: '', suffix: '+', sort_order: 3 },
]

const ICON_META: { iconName: string; description: string }[] = [
  { iconName: 'briefcase', description: 'Real-world AI deployments' },
  { iconName: 'award',     description: 'LLM apps, RAG & intelligent workflows' },
  { iconName: 'users',     description: 'Industry-recognized credentials' },
  { iconName: 'bookopen',  description: 'Large-scale tech events & workshops' },
]

export async function FeaturedHighlightsSection() {
  let stats: StatRow[] = FALLBACK_STATS

  try {
    const supabase = await createClient()
    const { data } = await (supabase
      .from('stats') as any)
      .select('label, value, prefix, suffix, sort_order')
      .order('sort_order')
    const statRows = data as StatRow[] | null
    if (statRows && statRows.length > 0) stats = statRows
  } catch {
    // fallbacks active
  }

  return (
    <section id="track-record" className="py-24 sm:py-32">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ScrollReveal direction="up">
            <SectionHeader
              label="By the Numbers"
              title="Track Record"
              subtitle="Proven expertise in delivering AI solutions that create real impact."
              align="left"
            />
          </ScrollReveal>

          <ScrollReveal
            direction="up"
            delay={150}
            className="flex justify-center lg:justify-end scale-[0.65] sm:scale-90 lg:scale-90 xl:scale-100 origin-center min-h-[280px] sm:min-h-[360px] lg:min-h-[420px] items-center"
          >
            <StatHighlightCards stats={stats} meta={ICON_META} />
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
