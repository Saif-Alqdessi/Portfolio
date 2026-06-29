'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { upsertProfile } from './actions'
import { GlassCard } from '@/components/ui/GlassCard'
import { Upload, Trash2, FileText, User } from 'lucide-react'

interface Profile {
  id: string
  summary: string
  highlights: string[]
  cv_url?: string | null
  photo_url?: string | null
}

const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-bg-surface/80 border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-text-muted'
const labelCls = 'block text-xs font-medium text-text-secondary mb-1.5'

export function ProfileClient({ profile }: { profile: Profile | null }) {
  const router = useRouter()
  const cvRef    = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)

  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [warning,      setWarning]      = useState('')
  const [success,      setSuccess]      = useState(false)
  const [cvPreview,    setCvPreview]    = useState<string | null>(profile?.cv_url ?? null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(profile?.photo_url ?? null)
  const [removeCv,     setRemoveCv]     = useState(false)
  const [removePhoto,  setRemovePhoto]  = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setWarning('')
    setSuccess(false)

    const fd = new FormData(e.currentTarget)
    fd.set('current_cv_url',    removeCv    ? '' : (profile?.cv_url    ?? ''))
    fd.set('current_photo_url', removePhoto ? '' : (profile?.photo_url ?? ''))

    const result = await upsertProfile(fd)
    setLoading(false)

    if (result?.error) {
      setError(result.error)
    } else {
      if (result?.bucketWarning) setWarning(result.bucketWarning)
      setSuccess(true)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-7 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-text-muted text-sm mt-1">Edit your public bio and uploads.</p>
      </div>

      {/* Summary */}
      <div>
        <label className={labelCls}>Bio / Summary</label>
        <textarea
          name="summary"
          required
          rows={5}
          defaultValue={profile?.summary ?? ''}
          placeholder="Write your professional summary…"
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Highlights */}
      <div>
        <label className={labelCls}>Highlights <span className="text-text-muted font-normal">(one per line)</span></label>
        <textarea
          name="highlights_text"
          rows={4}
          defaultValue={(profile?.highlights ?? []).join('\n')}
          placeholder={'IEEE Best Ambassador 2023\nConference Chair — 300+ attendees'}
          className={`${inputCls} resize-none font-mono text-xs`}
        />
      </div>

      {/* CV Upload */}
      <div>
        <label className={labelCls}>CV / Résumé</label>
        <GlassCard variant="default" className="!p-4 space-y-3">
          {cvPreview && !removeCv ? (
            <div className="flex items-center gap-3">
              <FileText size={18} className="text-accent-cyan flex-shrink-0" />
              <a href={cvPreview} target="_blank" rel="noopener noreferrer" className="text-accent-cyan text-xs hover:underline truncate flex-1">
                {cvPreview.split('/').pop()}
              </a>
              <button
                type="button"
                onClick={() => { setRemoveCv(true); setCvPreview(null); if (cvRef.current) cvRef.current.value = '' }}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => cvRef.current?.click()}
              className="h-20 border-2 border-dashed border-white/15 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-accent-cyan/40 transition-colors"
            >
              <Upload size={16} className="text-text-muted" />
              <span className="text-text-muted text-xs">Click to upload PDF / DOCX</span>
            </div>
          )}
          <input ref={cvRef} name="cv_file" type="file" accept=".pdf,.doc,.docx" onChange={e => {
            if (e.target.files?.[0]) { setCvPreview(e.target.files[0].name); setRemoveCv(false) }
          }} className="hidden" />
        </GlassCard>
      </div>

      {/* Photo Upload */}
      <div>
        <label className={labelCls}>Profile Photo</label>
        <GlassCard variant="default" className="!p-4 space-y-3">
          {photoPreview && !removePhoto ? (
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-white/10 flex-shrink-0" />
              <span className="text-text-secondary text-xs flex-1 truncate">{photoPreview.split('/').pop()}</span>
              <button
                type="button"
                onClick={() => { setRemovePhoto(true); setPhotoPreview(null); if (photoRef.current) photoRef.current.value = '' }}
                className="text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ) : (
            <div
              onClick={() => photoRef.current?.click()}
              className="h-20 border-2 border-dashed border-white/15 rounded-lg flex flex-col items-center justify-center gap-1.5 cursor-pointer hover:border-accent-cyan/40 transition-colors"
            >
              <User size={16} className="text-text-muted" />
              <span className="text-text-muted text-xs">Click to upload photo</span>
            </div>
          )}
          <input ref={photoRef} name="photo_file" type="file" accept="image/*" onChange={e => {
            if (e.target.files?.[0]) {
              setPhotoPreview(URL.createObjectURL(e.target.files[0]))
              setRemovePhoto(false)
            }
          }} className="hidden" />
        </GlassCard>
      </div>

      {error   && <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
      {warning && <p className="text-yellow-400 text-xs bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">{warning}</p>}
      {success && !warning && <p className="text-green-400 text-xs bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2">Saved successfully.</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2.5 rounded-lg bg-accent-cyan text-bg-base font-semibold text-sm hover:bg-accent-cyan/90 disabled:opacity-50 transition-all"
      >
        {loading ? 'Saving…' : 'Save Profile'}
      </button>
    </form>
  )
}
