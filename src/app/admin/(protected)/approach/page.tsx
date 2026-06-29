import { createClient } from '@/lib/supabase/server'
import { ApproachForm } from '@/components/admin/ApproachForm'
import { ApproachClient } from './client'
import type { Tables } from '@/lib/supabase/types'

type Approach = Tables<'approach'>

export default async function AdminApproachPage() {
  const supabase = await createClient()
  const { data: approaches } = await supabase
    .from('approach')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Approach</h1>
          <p className="text-text-muted text-sm mt-1">Manage engineering approach steps</p>
        </div>
        <ApproachForm />
      </div>

      {approaches && approaches.length > 0 ? (
        <div className="bg-bg-surface border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Step</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Active</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Sort Order</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <ApproachClient approaches={approaches} />
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-bg-surface border border-white/10 rounded-xl">
          <p className="text-text-muted text-sm">No approach steps found. Create your first step to get started.</p>
        </div>
      )}
    </div>
  )
}
