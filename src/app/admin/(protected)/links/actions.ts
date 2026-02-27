'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createLink(formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const platform = (formData.get('platform') as string).trim()
  let url = (formData.get('url') as string).trim()
  
  if (platform.toLowerCase() === 'email' && !url.toLowerCase().startsWith('mailto:')) {
    url = `mailto:${url}`
  }
  
  const payload = {
    platform,
    url,
    icon: (formData.get('icon') as string).trim() || 'Link',
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('links') as any).insert(payload)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/links')
  revalidatePath('/')
  return {}
}

export async function updateLink(id: string, formData: FormData): Promise<{ error?: string }> {
  const supabase = await createClient()
  
  const platform = (formData.get('platform') as string).trim()
  let url = (formData.get('url') as string).trim()
  
  if (platform.toLowerCase() === 'email' && !url.toLowerCase().startsWith('mailto:')) {
    url = `mailto:${url}`
  }
  
  const payload = {
    platform,
    url,
    icon: (formData.get('icon') as string).trim() || 'Link',
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase.from('links') as any).update(payload).eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/links')
  revalidatePath('/')
  return {}
}

export async function deleteLink(id: string): Promise<{ error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('links').delete().eq('id', id)
  if (error) return { error: error.message }
  
  revalidatePath('/admin/links')
  revalidatePath('/')
  return {}
}
