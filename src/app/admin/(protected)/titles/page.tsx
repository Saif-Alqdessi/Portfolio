import { createClient } from '@/lib/supabase/server'
import { TitleForm } from '@/components/admin/TitleForm'
import { TitlesClient } from './client'
import type { Tables } from '@/lib/supabase/types'

type Title = Tables<'titles'>

export default async function AdminTitlesPage() {
  const supabase = await createClient()
  const { data: titles } = await supabase
    .from('titles')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Titles</h1>
          <p className="text-text-muted text-sm mt-1">Manage rotating hero titles</p>
        </div>
        <TitleForm />
      </div>

      {titles && titles.length > 0 ? (
        <div className="bg-bg-surface border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Sort Order</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <TitlesClient titles={titles} />
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-bg-surface border border-white/10 rounded-xl">
          <p className="text-text-muted text-sm">No titles found. Create your first title to get started.</p>
        </div>
      )}
    </div>
  )
}
