'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteApproach } from './actions'
import { ApproachForm } from '@/components/admin/ApproachForm'
import { Trash2 } from 'lucide-react'
import type { Tables } from '@/lib/supabase/types'

type Approach = Tables<'approach'>

interface Props {
  approaches: Approach[]
}

export function ApproachClient({ approaches }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(id)
    setError(null)
    const result = await deleteApproach(id)
    setDeleting(null)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <>
      {approaches.map((approach) => (
        <tr key={approach.id} className="hover:bg-white/5 transition-colors">
          <td className="px-4 py-3">
            <span className="text-text-primary text-sm font-mono font-bold">
              {String(approach.step_number).padStart(2, '0')}
            </span>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-primary text-sm font-medium">{approach.title}</span>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-secondary text-sm max-w-xs truncate block">{approach.description}</span>
          </td>
          <td className="px-4 py-3">
            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
              approach.is_active 
                ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20' 
                : 'bg-white/5 text-text-muted border border-white/10'
            }`}>
              {approach.is_active ? 'Active' : 'Inactive'}
            </span>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-secondary text-sm">{approach.sort_order}</span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center justify-end gap-2">
              <ApproachForm approach={approach} />
              <button
                onClick={() => handleDelete(approach.id)}
                disabled={deleting === approach.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                <Trash2 size={12} />
                {deleting === approach.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </td>
        </tr>
      ))}
      {error && (
        <tr>
          <td colSpan={6} className="px-4 py-3">
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          </td>
        </tr>
      )}
    </>
  )
}
