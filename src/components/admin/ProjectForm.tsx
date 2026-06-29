'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createProject, updateProject } from '@/app/admin/(protected)/projects/actions'
import { createClient } from '@/lib/supabase/client'
import { X, Plus, Upload, Trash2, Loader2 } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'

interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  image_url: string | null
  github_url: string | null
  live_url: string | null
  featured: boolean
  sort_order: number
}

interface Props {
  project?: Project
}

export function ProjectForm({ project }: Props) {
  const router = useRouter()
  const fileRef  = useRef<HTMLInputElement>(null)

  const [tags,          setTags]          = useState<string[]>(project?.tech ?? [])
  const [tagInput,      setTagInput]      = useState('')
  const [featured,      setFeatured]      = useState(project?.featured ?? false)
  const [imagePreview,  setImagePreview]  = useState<string | null>(project?.image_url ?? null)
  const [imageFile,     setImageFile]     = useState<File | null>(null)
  const [removeImage,   setRemoveImage]   = useState(false)
  const [uploading,     setUploading]     = useState(false)
  const [uploadProgress,setUploadProgress]= useState<string>('')
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')

  function addTag() {
    const t = tagInput.trim()
    if (t && !tags.includes(t)) setTags(prev => [...prev, t])
    setTagInput('')
  }

  function handleTagKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') { e.preventDefault(); addTag() }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowed.includes(file.type)) {
        setError('Only JPG, PNG, WebP or GIF images are allowed.')
        return
      }
      setImageFile(file)
      setImagePreview(URL.createObjectURL(file))
      setRemoveImage(false)
      setError('')
    }
  }

  function handleRemoveImage() {
    setImagePreview(null)
    setImageFile(null)
    setRemoveImage(true)
    if (fileRef.current) fileRef.current.value = ''
  }

  async function uploadImageToStorage(file: File, projectId: string): Promise<string | null> {
    const supabase = createClient()
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'jpg'
    const path = `projects/${projectId}/${Date.now()}.${ext}`
    setUploadProgress('Uploading image…')
    const { error } = await supabase.storage
      .from('project-images')
      .upload(path, file, { upsert: true, contentType: file.type })
    if (error) {
      setUploadProgress('')
      throw new Error(`Image upload failed: ${error.message}`)
    }
    const { data } = supabase.storage.from('project-images').getPublicUrl(path)
    setUploadProgress('')
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formEl = e.currentTarget
    setLoading(true)
    setUploading(false)
    setError('')

    try {
      const projectId = project?.id ?? crypto.randomUUID()

      // Determine the final image URL
      let resolvedImageUrl: string | null = removeImage ? null : (project?.image_url ?? null)

      if (imageFile && !removeImage) {
        setUploading(true)
        resolvedImageUrl = await uploadImageToStorage(imageFile, projectId)
        setUploading(false)
      }

      const formData = new FormData(formEl)
      formData.set('tags',      JSON.stringify(tags))
      formData.set('featured',  String(featured))
      formData.set('image_url', resolvedImageUrl ?? '')

      const result = project?.id
        ? await updateProject(project.id, formData)
        : await createProject(projectId, formData)

      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        router.push('/admin/projects')
        router.refresh()
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setUploading(false)
      setLoading(false)
    }
  }

  const inputCls = 'w-full px-3 py-2.5 rounded-lg bg-bg-surface/80 border border-white/10 text-text-primary text-sm focus:outline-none focus:border-accent-cyan/50 transition-colors placeholder:text-text-muted'
  const labelCls = 'block text-xs font-medium text-text-secondary mb-1.5'

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">

      {/* Title */}
      <div>
        <label className={labelCls}>Title *</label>
        <input name="title" required defaultValue={project?.title ?? ''} placeholder="Project title" className={inputCls} />
      </div>

      {/* Description */}
      <div>
        <label className={labelCls}>Description *</label>
        <textarea name="description" required rows={4} defaultValue={project?.description ?? ''} placeholder="Short project description" className={`${inputCls} resize-none`} />
      </div>

      {/* URLs row */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>GitHub URL</label>
          <input name="github_url" type="url" defaultValue={project?.github_url ?? ''} placeholder="https://github.com/..." className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Live URL</label>
          <input name="live_url" type="url" defaultValue={project?.live_url ?? ''} placeholder="https://..." className={inputCls} />
        </div>
      </div>

      {/* Sort order + Featured row */}
      <div className="flex gap-6 items-center">
        <div className="w-32">
          <label className={labelCls}>Sort Order</label>
          <input name="sort_order" type="number" min={0} defaultValue={project?.sort_order ?? 0} className={inputCls} />
        </div>
        <div className="flex items-center gap-2 pt-5">
          <button
            type="button"
            onClick={() => setFeatured(v => !v)}
            className={`w-10 h-5 rounded-full transition-colors relative ${featured ? 'bg-accent-cyan' : 'bg-white/10'}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${featured ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </button>
          <label className="text-sm text-text-secondary cursor-pointer" onClick={() => setFeatured(v => !v)}>
            Featured
          </label>
        </div>
      </div>

      {/* Image upload */}
      <div>
        <label className={labelCls}>Project Image</label>
        <GlassCard variant="default" className="!p-4 space-y-3">
          {imagePreview && !removeImage ? (
            <div className="relative inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Preview" className="h-40 w-auto rounded-lg object-cover border border-white/10" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-400 transition-colors"
              >
                <Trash2 size={11} className="text-white" />
              </button>
            </div>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="h-28 border-2 border-dashed border-white/15 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-accent-cyan/40 transition-colors"
            >
              <Upload size={20} className="text-text-muted" />
              <span className="text-text-muted text-xs">Click to upload image</span>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            className="hidden"
          />
          {!imagePreview && (
            <button type="button" onClick={() => fileRef.current?.click()} className="text-xs text-accent-cyan hover:underline">
              Browse file
            </button>
          )}
          {uploadProgress && (
            <p className="flex items-center gap-1.5 text-xs text-accent-cyan">
              <Loader2 size={12} className="animate-spin" />
              {uploadProgress}
            </p>
          )}
        </GlassCard>
      </div>

      {/* Tech tags */}
      <div>
        <label className={labelCls}>Tech Tags</label>
        <div className="space-y-3">
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <span key={tag} className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border border-white/15 bg-bg-surface/60 text-text-secondary">
                  {tag}
                  <button type="button" onClick={() => setTags(t => t.filter(x => x !== tag))}>
                    <X size={11} className="text-text-muted hover:text-red-400 transition-colors" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              placeholder="Type tag and press Enter"
              className={`${inputCls} flex-1`}
            />
            <button
              type="button"
              onClick={addTag}
              className="px-3 py-2 rounded-lg bg-accent-cyan/10 border border-accent-cyan/20 text-accent-cyan hover:bg-accent-cyan/20 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent-cyan text-bg-base font-semibold text-sm hover:bg-accent-cyan/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {(loading || uploading) && <Loader2 size={14} className="animate-spin" />}
          {uploading ? 'Uploading…' : loading ? 'Saving…' : project ? 'Save Changes' : 'Create Project'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/projects')}
          className="px-6 py-2.5 rounded-lg border border-white/10 text-text-secondary text-sm hover:bg-bg-elevated transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
