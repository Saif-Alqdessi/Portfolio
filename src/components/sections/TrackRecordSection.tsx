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

const ICON_META: { iconName: string; color: 'cyan' | 'purple'; description: string }[] = [
  { iconName: 'briefcase', color: 'cyan',   description: 'Real-world AI deployments' },
  { iconName: 'award',     color: 'cyan',   description: 'LLM apps, RAG & intelligent workflows'    },
  { iconName: 'users',     color: 'purple', description: 'Industry-recognized credentials'    },
  { iconName: 'building2', color: 'purple', description: 'Large-scale tech events & workshops'           },
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
          subtitle="Proven expertise in delivering AI solutions that create real impact."
          align="center"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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
                color={meta.color}
                delay={i * 120}
              />
            )
          })}
        </div>

      </div>
    </section>
  )
}
