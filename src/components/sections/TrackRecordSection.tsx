import { createClient } from '@/lib/supabase/server'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { CountUpStat } from './CountUpStat'
import type { Database } from '@/lib/supabase/types'

type StatRow = Database['public']['Tables']['stats']['Row']


const FALLBACK_STATS: StatRow[] = [
  { id: '1', label: 'Projects Delivered',      value: 4,   prefix: '', suffix: '+', sort_order: 0 },
  { id: '2', label: 'Certifications',          value: 10,  prefix: '', suffix: '+', sort_order: 1 },
  { id: '3', label: 'Volunteers Led',          value: 30,  prefix: '', suffix: '+', sort_order: 2 },
  { id: '4', label: 'Conference Participants', value: 300, prefix: '', suffix: '+', sort_order: 3 },
]

const ICON_META: { iconName: string; description: string }[] = [
  { iconName: 'briefcase', description: 'Shipped and running in production' },
  { iconName: 'brain',     description: 'Agents, RAG pipelines, and LLM apps' },
  { iconName: 'award',     description: 'AI, ML, and cloud coursework' },
  { iconName: 'users',     description: 'Conferences, workshops, and meetups' },
]

export async function TrackRecordSection() {
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
      <div className="max-w-6xl mx-auto px-6 space-y-16">

        <SectionHeader
          label="By the Numbers"
          title="Track Record"
          subtitle="What I've shipped, earned, and organised so far."
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => {
            const meta = ICON_META[i] ?? ICON_META[0]
            return (
              <CountUpStat
                key={stat.label}
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                label={stat.label}
                description={meta.description}
                iconName={meta.iconName}
                delay={i * 120}
              />
            )
          })}
        </div>

      </div>
    </section>
  )
}
