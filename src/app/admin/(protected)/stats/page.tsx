import { createClient } from '@/lib/supabase/server'
import { StatForm } from '@/components/admin/StatForm'
import { StatsClient } from './client'
import type { Tables } from '@/lib/supabase/types'

type Stat = Tables<'stats'>

export default async function AdminStatsPage() {
  const supabase = await createClient()
  const { data: stats } = await supabase
    .from('stats')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Stats</h1>
          <p className="text-text-muted text-sm mt-1">Manage track record statistics</p>
        </div>
        <StatForm />
      </div>

      {stats && stats.length > 0 ? (
        <div className="bg-bg-surface border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Label</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Value</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Prefix</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Suffix</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Sort Order</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <StatsClient stats={stats} />
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-bg-surface border border-white/10 rounded-xl">
          <p className="text-text-muted text-sm">No stats found. Create your first stat to get started.</p>
        </div>
      )}
    </div>
  )
}
