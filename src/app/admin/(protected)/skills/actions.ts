'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createSkill(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const itemsRaw = (formData.get('items_text') as string) ?? ''
  const items = JSON.stringify(
    itemsRaw.split('\n').map(l => l.trim()).filter(Boolean)
  )
  
  const payload = {
    category: (formData.get('category') as string).trim(),
    items,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  const { error } = await (supabase.from('skills') as any).insert(payload)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/skills')
  revalidatePath('/')
  return {}
}

export async function updateSkill(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const itemsRaw = (formData.get('items_text') as string) ?? ''
  const items = JSON.stringify(
    itemsRaw.split('\n').map(l => l.trim()).filter(Boolean)
  )
  
  const payload = {
    category: (formData.get('category') as string).trim(),
    items,
    sort_order: parseInt(formData.get('sort_order') as string) || 0,
  }
  
  const { error } = await (supabase.from('skills') as any).update(payload).eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/skills')
  revalidatePath('/')
  return {}
}

export async function deleteSkill(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await (supabase.from('skills') as any).delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/skills')
  revalidatePath('/')
  return {}
}
