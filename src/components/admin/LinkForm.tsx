'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createLink, updateLink } from '@/app/admin/(protected)/links/actions'
import { AdminModal } from './AdminModal'
import { Plus, Edit2 } from 'lucide-react'
interface Link {
  id: string
  platform: string
  url: string
  icon: string
}

interface Props {
  link?: Link
}

const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-bg-surface/80 border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-text-muted'
const labelCls = 'block text-xs font-medium text-text-secondary mb-1.5'

export function LinkForm({ link }: Props) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isEdit = !!link
  
  const initialPlatform = link?.platform ?? ''
  let initialUrl = link?.url ?? ''
  if (initialPlatform.toLowerCase() === 'email' && initialUrl.toLowerCase().startsWith('mailto:')) {
    initialUrl = initialUrl.slice(7)
  }

  const [platform, setPlatform] = useState(initialPlatform)
  const [url, setUrl] = useState(initialUrl)

  const isEmail = platform.trim().toLowerCase() === 'email'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = isEdit 
      ? await updateLink(link.id, formData)
      : await createLink(formData)

    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      setOpen(false)
      router.refresh()
    }
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value
    if (isEmail && val.toLowerCase().startsWith('mailto:')) {
      val = val.slice(7)
    }
    setUrl(val)
  }

  return (
    <>
      <button
        onClick={() => {
          setOpen(true)
          setPlatform(initialPlatform)
          setUrl(initialUrl)
          setError('')
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
          isEdit
            ? 'text-text-secondary border border-white/10 bg-white/5 hover:bg-white/10'
            : 'text-bg-base bg-accent-cyan hover:bg-accent-cyan/90'
        }`}
      >
        {isEdit ? <Edit2 size={12} /> : <Plus size={12} />}
        {isEdit ? 'Edit' : 'Add Link'}
      </button>

      <AdminModal
        open={open}
        onClose={() => setOpen(false)}
        title={isEdit ? 'Edit Link' : 'Add New Link'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Platform</label>
            <input
              name="platform"
              type="text"
              required
              value={platform}
              onChange={(e) => {
                setPlatform(e.target.value)
                const newIsEmail = e.target.value.trim().toLowerCase() === 'email'
                if (newIsEmail && url.toLowerCase().startsWith('mailto:')) {
                  setUrl(url.slice(7))
                }
              }}
              placeholder="GitHub, LinkedIn, Email, WhatsApp, Twitter..."
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>URL {isEmail && <span className="text-text-muted font-normal">(Email address)</span>}</label>
            <input
              name="url"
              type={isEmail ? "email" : "url"}
              required
              value={url}
              onChange={handleUrlChange}
              placeholder={isEmail ? "hello@example.com" : "https://github.com/username"}
              className={inputCls}
            />
          </div>

          <div>
            <label className={labelCls}>Icon <span className="text-text-muted font-normal">(Lucide icon name)</span></label>
            <input
              name="icon"
              type="text"
              defaultValue={link?.icon ?? ''}
              placeholder="Github, Linkedin, Twitter..."
              className={inputCls}
            />
            <p className="text-text-muted text-xs mt-1">Leave empty to use "Link" as default</p>
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
