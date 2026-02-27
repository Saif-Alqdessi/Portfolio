'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteService } from './actions'
import { ServiceForm } from '@/components/admin/ServiceForm'
import { Trash2 } from 'lucide-react'
import type { Tables } from '@/lib/supabase/types'

type Service = Tables<'services'>

interface Props {
  services: Service[]
}

export function ServicesClient({ services }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(id)
    setError(null)
    const result = await deleteService(id)
    setDeleting(null)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <>
      {services.map((service) => (
        <tr key={service.id} className="hover:bg-white/5 transition-colors">
          <td className="px-4 py-3">
            <span className="text-text-primary text-sm font-medium">{service.title}</span>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-secondary text-sm max-w-xs truncate block">{service.description}</span>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-secondary text-sm font-mono">{service.icon}</span>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-secondary text-sm">{service.sort_order}</span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center justify-end gap-2">
              <ServiceForm service={service} />
              <button
                onClick={() => handleDelete(service.id)}
                disabled={deleting === service.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                <Trash2 size={12} />
                {deleting === service.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </td>
        </tr>
      ))}
      {error && (
        <tr>
          <td colSpan={5} className="px-4 py-3">
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          </td>
        </tr>
      )}
    </>
  )
}
