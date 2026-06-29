'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createTitle(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const payload = {
    title: (formData.get('title') as string).trim(),
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  const { error } = await (supabase.from('titles') as any).insert(payload)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/titles')
  revalidatePath('/')
  return {}
}

export async function updateTitle(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const payload = {
    title: (formData.get('title') as string).trim(),
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  const { error } = await (supabase.from('titles') as any).update(payload).eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/titles')
  revalidatePath('/')
  return {}
}

export async function deleteTitle(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await (supabase.from('titles') as any).delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/titles')
  revalidatePath('/')
  return {}
}
