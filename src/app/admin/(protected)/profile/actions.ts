'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/supabase/types'

type ProfileRow = Database['public']['Tables']['profile']['Row']

async function uploadFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  file: File,
  bucket: string,
  pathPrefix: string
): Promise<{ url: string | null; bucketMissing?: boolean }> {
  const path = `${pathPrefix}/${Date.now()}-${file.name.replace(/\s/g, '_')}`
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) {
    if (error.message.includes('Bucket not found') || error.message.includes('bucket')) {
      return { url: null, bucketMissing: true }
    }
    return { url: null }
  }
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { url: data.publicUrl }
}

export async function upsertProfile(
  formData: FormData
): Promise<{ error?: string; bucketWarning?: string }> {
  const supabase = await createClient()

  const highlightsRaw = (formData.get('highlights_text') as string) ?? ''
  const highlights = JSON.stringify(
    highlightsRaw.split('\n').map(l => l.trim()).filter(Boolean)
  )

  const existingCvUrl   = (formData.get('current_cv_url')    as string) || null
  const existingPhotoUrl= (formData.get('current_photo_url') as string) || null
  let cvUrl    = existingCvUrl
  let photoUrl = existingPhotoUrl
  const warnings: string[] = []

  const cvFile    = formData.get('cv_file')    as File | null
  const photoFile = formData.get('photo_file') as File | null

  if (cvFile && cvFile.size > 0) {
    const result = await uploadFile(supabase, cvFile, 'documents', 'cv')
    if (result.bucketMissing) warnings.push("'documents' bucket not found — CV not uploaded.")
    else if (result.url) cvUrl = result.url
  }

  if (photoFile && photoFile.size > 0) {
    const result = await uploadFile(supabase, photoFile, 'profile-photos', 'profile')
    if (result.bucketMissing) warnings.push("'profile-photos' bucket not found — photo not uploaded.")
    else if (result.url) photoUrl = result.url
  }

  const { data } = await (supabase.from('profile') as any).select('id').limit(1).single()
  const existing = data as ProfileRow | null

  const payload = {
    summary: (formData.get('summary') as string).trim(),
    highlights,
    updated_at: new Date().toISOString(),
    cv_url: cvUrl,
    photo_url: photoUrl,
  }

  let dbError
  if (existing && existing.id) {
    const { error } = await (supabase.from('profile') as any).update(payload).eq('id', existing.id)
    dbError = error
  } else {
    const { error } = await (supabase.from('profile') as any).insert(payload)
    dbError = error
  }

  if (dbError) return { error: dbError.message }

  revalidatePath('/admin/profile')
  revalidatePath('/')
  return warnings.length ? { bucketWarning: warnings.join(' ') } : {}
}
