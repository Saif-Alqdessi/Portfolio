'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createService, updateService } from '@/app/admin/(protected)/services/actions'
import { AdminModal } from './AdminModal'
import { Plus, Edit2 } from 'lucide-react'
import type { Tables } from '@/lib/supabase/types'

type Service = Tables<'services'>

interface Props {
  service?: Service
}

const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-bg-surface/80 border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-text-muted'
const labelCls = 'block text-xs font-medium text-text-secondary mb-1.5'

export function ServiceForm({ service }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!service

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = isEdit 
      ? await updateService(service.id, formData)
      : await createService(formData)

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
        {isEdit ? 'Edit' : 'Add Service'}
      </button>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={isEdit ? 'Edit Service' : 'Add New Service'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Title</label>
            <input
              name="title"
              type="text"
              required
              defaultValue={service?.title ?? ''}
              placeholder="Web Development, AI Solutions..."
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea
              name="description"
              rows={3}
              required
              defaultValue={service?.description ?? ''}
              placeholder="Brief description of the service..."
              className={`${inputCls} resize-none`}
            />
          </div>

          <div>
            <label className={labelCls}>Icon <span className="text-text-muted font-normal">(Lucide icon name)</span></label>
            <input
              name="icon"
              type="text"
              defaultValue={service?.icon ?? ''}
              placeholder="Code, Briefcase, Zap..."
              className={inputCls}
            />
            <p className="text-text-muted text-xs mt-1">Leave empty to use "Briefcase" as default</p>
          </div>

          <div>
            <label className={labelCls}>Sort Order</label>
            <input
              name="sort_order"
              type="number"
              min="0"
              defaultValue={service?.sort_order ?? 0}
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
