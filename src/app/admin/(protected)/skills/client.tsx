'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteSkill } from './actions'
import { SkillForm } from '@/components/admin/SkillForm'
import { Trash2 } from 'lucide-react'
import type { Tables } from '@/lib/supabase/types'

type Skill = Tables<'skills'>

interface Props {
  skills: Skill[]
}

export function SkillsClient({ skills }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: string) {
    setDeleting(id)
    setError(null)
    const result = await deleteSkill(id)
    setDeleting(null)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <>
      {skills.map((skill) => (
        <tr key={skill.id} className="hover:bg-white/5 transition-colors">
          <td className="px-4 py-3">
            <span className="text-text-primary text-sm font-medium">{skill.category}</span>
          </td>
          <td className="px-4 py-3">
            <div className="flex flex-wrap gap-1 max-w-md">
              {skill.items.slice(0, 3).map((item, i) => (
                <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-xs text-text-secondary">
                  {item}
                </span>
              ))}
              {skill.items.length > 3 && (
                <span className="px-2 py-0.5 text-xs text-text-muted">
                  +{skill.items.length - 3} more
                </span>
              )}
            </div>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-secondary text-sm">{skill.sort_order}</span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center justify-end gap-2">
              <SkillForm skill={skill} />
              <button
                onClick={() => handleDelete(skill.id)}
                disabled={deleting === skill.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                <Trash2 size={12} />
                {deleting === skill.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </td>
        </tr>
      ))}
      {error && (
        <tr>
          <td colSpan={4} className="px-4 py-3">
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          </td>
        </tr>
      )}
    </>
  )
}
