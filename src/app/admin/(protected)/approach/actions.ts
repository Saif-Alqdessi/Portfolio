'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createApproach(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const payload = {
    step_number: parseInt(formData.get('step_number') as string) || 1,
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim(),
    is_active: formData.get('is_active') === 'on',
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  const { error } = await (supabase.from('approach') as any).insert(payload)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/approach')
  revalidatePath('/')
  return {}
}

export async function updateApproach(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const payload = {
    step_number: parseInt(formData.get('step_number') as string) || 1,
    title: (formData.get('title') as string).trim(),
    description: (formData.get('description') as string).trim(),
    is_active: formData.get('is_active') === 'on',
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  const { error } = await (supabase.from('approach') as any).update(payload).eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/approach')
  revalidatePath('/')
  return {}
}

export async function deleteApproach(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await (supabase.from('approach') as any).delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/approach')
  revalidatePath('/')
  return {}
}
