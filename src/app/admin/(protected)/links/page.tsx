import { createClient } from '@/lib/supabase/server'
import { LinkForm } from '@/components/admin/LinkForm'
import { LinksClient } from './client'

interface Link {
  id: string
  platform: string
  url: string
  icon: string
}

export default async function AdminLinksPage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: links } = await (supabase
    .from('links')
    .select('*')
    .order('platform', { ascending: true }) as any) as { data: Link[] | null }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Links</h1>
          <p className="text-text-muted text-sm mt-1">Manage social and professional links</p>
        </div>
        <LinkForm />
      </div>

      {links && links.length > 0 ? (
        <div className="bg-bg-surface border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Platform</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">URL</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Icon</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <LinksClient links={links} />
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-bg-surface border border-white/10 rounded-xl">
          <p className="text-text-muted text-sm">No links found. Create your first link to get started.</p>
        </div>
      )}
    </div>
  )
}
