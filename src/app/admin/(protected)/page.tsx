import { createClient } from '@/lib/supabase/server'
import { GlassCard } from '@/components/ui/GlassCard'
import { FolderOpen, Briefcase, Code2, Activity } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  const [
    { count: projectsCount },
    { count: servicesCount },
    { count: skillsCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('services').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Projects',  value: projectsCount ?? 0, icon: FolderOpen, color: 'cyan'   },
    { label: 'Services',  value: servicesCount ?? 0, icon: Briefcase,  color: 'purple' },
    { label: 'Skills',    value: skillsCount   ?? 0, icon: Code2,      color: 'cyan'   },
  ] as const

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">Overview of your portfolio content.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <GlassCard key={label} variant="default" className="flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${color === 'cyan' ? 'bg-accent-cyan/10' : 'bg-accent-purple/10'}`}>
              <Icon size={20} className={color === 'cyan' ? 'text-accent-cyan' : 'text-accent-purple'} />
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">{value}</p>
              <p className="text-text-muted text-xs">{label}</p>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard variant="default" className="flex items-center gap-3 text-sm text-text-secondary">
        <Activity size={14} className="text-accent-cyan flex-shrink-0" />
        <span>
          Admin panel is active. Use the sidebar to manage portfolio content.
        </span>
      </GlassCard>
    </div>
  )
}
