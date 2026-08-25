'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// `tech` is a text[] column, edited in the admin as one comma-separated field.
function parseTech(raw: string | null): string[] {
  return (raw ?? '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean)
}

export async function createService(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const payload = {
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim(),
    icon: (formData.get('icon') as string).trim() || 'Briefcase',
    tech: parseTech(formData.get('tech') as string),
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  const { error } = await (supabase.from('services') as any).insert(payload)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/services')
  revalidatePath('/')
  return {}
}

export async function updateService(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const payload = {
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim(),
    icon: (formData.get('icon') as string).trim() || 'Briefcase',
    tech: parseTech(formData.get('tech') as string),
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  const { error } = await (supabase.from('services') as any).update(payload).eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/services')
  revalidatePath('/')
  return {}
}

export async function deleteService(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await (supabase.from('services') as any).delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/services')
  revalidatePath('/')
  return {}
}
