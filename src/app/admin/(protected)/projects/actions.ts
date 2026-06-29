'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { Database } from '@/lib/supabase/types'

type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']
type ProjectTechTagInsert = Database['public']['Tables']['project_tech_tags']['Insert']

function extractStoragePath(publicUrl: string): string | null {
  const match = publicUrl.match(/project-images\/(.+)$/)
  return match ? match[1] : null
}

export async function createProject(
  projectId: string,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const imageUrlRaw = (formData.get('image_url') as string) || ''
  const imageUrl: string | null = imageUrlRaw.startsWith('http') ? imageUrlRaw : null

  const tags: string[] = JSON.parse((formData.get('tags') as string) || '[]')

  const payload: ProjectInsert = {
    id: projectId,
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim(),
    image_url: imageUrl,
    github_url: (formData.get('github_url') as string) || null,
    live_url: (formData.get('live_url') as string) || null,
    featured: formData.get('featured') === 'true',
    sort_order: parseInt((formData.get('sort_order') as string) || '0') || 0,
  }

  const { error } = await (supabase.from('projects') as any).insert(payload)
  if (error) return { error: error.message }

  if (tags.length > 0) {
    const tagPayloads: ProjectTechTagInsert[] = tags.map((name, i) => ({ project_id: projectId, name, sort_order: i }))
    await (supabase.from('project_tech_tags') as any).insert(tagPayloads)
  }

  revalidatePath('/admin/projects')
  revalidatePath('/')
  return {}
}

export async function updateProject(
  id: string,
  formData: FormData
): Promise<{ error?: string }> {
  const supabase = await createClient()

  const imageUrlRaw = (formData.get('image_url') as string) || ''
  const imageUrl: string | null = imageUrlRaw.startsWith('http') ? imageUrlRaw : null

  const tags: string[] = JSON.parse((formData.get('tags') as string) || '[]')

  const updatePayload: ProjectUpdate = {
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim(),
    image_url: imageUrl,
    github_url: (formData.get('github_url') as string) || null,
    live_url: (formData.get('live_url') as string) || null,
    featured: formData.get('featured') === 'true',
    sort_order: parseInt((formData.get('sort_order') as string) || '0') || 0,
  }

  const { error } = await (supabase.from('projects') as any).update(updatePayload).eq('id', id)
  if (error) return { error: error.message }

  await (supabase.from('project_tech_tags') as any).delete().eq('project_id', id)
  if (tags.length > 0) {
    const tagPayloads: ProjectTechTagInsert[] = tags.map((name, i) => ({ project_id: id, name, sort_order: i }))
    await (supabase.from('project_tech_tags') as any).insert(tagPayloads)
  }

  revalidatePath('/admin/projects')
  revalidatePath('/')
  return {}
}

export async function deleteProject(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()

  const { data } = await (supabase
    .from('projects') as any)
    .select('image_url')
    .eq('id', id)
    .single()

  const project = data as { image_url: string | null } | null

  if (project?.image_url) {
    const p = extractStoragePath(project.image_url)
    if (p) await supabase.storage.from('project-images').remove([p])
  }

  const { error } = await (supabase.from('projects') as any).delete().eq('id', id)
  if (error) return { error: error.message }

  revalidatePath('/admin/projects')
  revalidatePath('/')
  return {}
}
