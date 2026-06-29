import { createClient } from '@/lib/supabase/server'
import { ProfileClient } from './client'

export default async function AdminProfilePage() {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (supabase.from('profile') as any)
    .select('id, summary, highlights, cv_url, photo_url')
    .limit(1)
    .single() as { data: { id: string; summary: string; highlights: string[]; cv_url: string | null; photo_url: string | null } | null }

  return <ProfileClient profile={data} />
}
