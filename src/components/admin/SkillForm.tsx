'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createSkill, updateSkill } from '@/app/admin/(protected)/skills/actions'
import { AdminModal } from './AdminModal'
import { Plus, Edit2 } from 'lucide-react'
import type { Tables } from '@/lib/supabase/types'

type Skill = Tables<'skills'>

interface Props {
  skill?: Skill
}

const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-bg-surface/80 border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-text-muted'
const labelCls = 'block text-xs font-medium text-text-secondary mb-1.5'

export function SkillForm({ skill }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!skill

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = isEdit 
      ? await updateSkill(skill.id, formData)
      : await createSkill(formData)

    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setOpen(false)
      router.refresh()
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          isEdit
            ? 'text-text-secondary border border-white/10 bg-white/5 hover:bg-white/10'
            : 'text-bg-base bg-accent-cyan hover:bg-accent-cyan/90'
        }`}
      >
        {isEdit ? <Edit2 size={12} /> : <Plus size={12} />}
        {isEdit ? 'Edit' : 'Add Skill'}
      </button>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={isEdit ? 'Edit Skill Category' : 'Add New Skill Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Category</label>
            <input
              name="category"
              type="text"
              required
              defaultValue={skill?.category ?? ''}
              placeholder="Frontend, Backend, Tools..."
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Items <span className="text-text-muted font-normal">(one per line)</span></label>
            <textarea
              name="items_text"
              rows={6}
              required
              defaultValue={(skill?.items ?? []).join('\n')}
              placeholder={'React\nNext.js\nTypeScript\nTailwind CSS'}
              className={`${inputCls} resize-none font-mono text-xs`}
            />
          </div>

          <div>
            <label className={labelCls}>Sort Order</label>
            <input
              name="sort_order"
              type="number"
              min="0"
              defaultValue={skill?.sort_order ?? 0}
              placeholder="0"
              className={inputCls}
            />
            <p className="text-text-muted text-xs mt-1">Lower numbers appear first</p>
          </div>

          {error && (
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex-1 px-4 py-2.5 rounded-lg border border-white/10 text-text-secondary text-sm hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 rounded-lg bg-accent-cyan text-bg-base font-semibold text-sm hover:bg-accent-cyan/90 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : isEdit ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </AdminModal>
    </>
  )
}
