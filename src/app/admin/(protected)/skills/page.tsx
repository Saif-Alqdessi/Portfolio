import { createClient } from '@/lib/supabase/server'
import { SkillForm } from '@/components/admin/SkillForm'
import { SkillsClient } from './client'
import type { Tables } from '@/lib/supabase/types'

type Skill = Tables<'skills'>

export default async function AdminSkillsPage() {
  const supabase = await createClient()
  const { data: skills } = await supabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Skills</h1>
          <p className="text-text-muted text-sm mt-1">Manage skill categories and items</p>
        </div>
        <SkillForm />
      </div>

      {skills && skills.length > 0 ? (
        <div className="bg-bg-surface border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Items</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Sort Order</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <SkillsClient skills={skills} />
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-bg-surface border border-white/10 rounded-xl">
          <p className="text-text-muted text-sm">No skills found. Create your first skill category to get started.</p>
        </div>
      )}
    </div>
  )
}
