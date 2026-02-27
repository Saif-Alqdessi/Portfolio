import { createClient } from '@/lib/supabase/server'
import { ServiceForm } from '@/components/admin/ServiceForm'
import { ServicesClient } from './client'
import type { Tables } from '@/lib/supabase/types'

type Service = Tables<'services'>

export default async function AdminServicesPage() {
  const supabase = await createClient()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .order('sort_order', { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Services</h1>
          <p className="text-text-muted text-sm mt-1">Manage what you do services</p>
        </div>
        <ServiceForm />
      </div>

      {services && services.length > 0 ? (
        <div className="bg-bg-surface border border-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Icon</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Sort Order</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-text-secondary uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <ServicesClient services={services} />
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 bg-bg-surface border border-white/10 rounded-xl">
          <p className="text-text-muted text-sm">No services found. Create your first service to get started.</p>
        </div>
      )}
    </div>
  )
}
