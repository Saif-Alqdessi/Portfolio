'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createStat(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const payload = {
    label: (formData.get('label') as string).trim(),
    value: parseInt(formData.get('value') as string) || 0,
    prefix: (formData.get('prefix') as string).trim(),
    suffix: (formData.get('suffix') as string).trim(),
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  const { error } = await (supabase.from('stats') as any).insert(payload)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/stats')
  revalidatePath('/')
  return {}
}

export async function updateStat(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const payload = {
    label: (formData.get('label') as string).trim(),
    value: parseInt(formData.get('value') as string) || 0,
    prefix: (formData.get('prefix') as string).trim(),
    suffix: (formData.get('suffix') as string).trim(),
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  const { error } = await (supabase.from('stats') as any).update(payload).eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/stats')
  revalidatePath('/')
  return {}
}

export async function deleteStat(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await (supabase.from('stats') as any).delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/stats')
  revalidatePath('/')
  return {}
}
