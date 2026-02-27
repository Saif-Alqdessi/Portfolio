'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteStat } from './actions'
import { StatForm } from '@/components/admin/StatForm'
import { Trash2 } from 'lucide-react'
import type { Tables } from '@/lib/supabase/types'

type Stat = Tables<'stats'>

interface Props {
  stats: Stat[]
}

export function StatsClient({ stats }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(id)
    setError(null)
    const result = await deleteStat(id)
    setDeleting(null)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <>
      {stats.map((stat) => (
        <tr key={stat.id} className="hover:bg-white/5 transition-colors">
          <td className="px-4 py-3">
            <span className="text-text-primary text-sm font-medium">{stat.label}</span>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-secondary text-sm font-mono">{stat.value}</span>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-secondary text-sm">{stat.prefix || '—'}</span>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-secondary text-sm">{stat.suffix || '—'}</span>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-secondary text-sm">{stat.sort_order}</span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center justify-end gap-2">
              <StatForm stat={stat} />
              <button
                onClick={() => handleDelete(stat.id)}
                disabled={deleting === stat.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                <Trash2 size={12} />
                {deleting === stat.id ? 'Deleting...' : 'Delete'}
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
