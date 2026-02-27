import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProjectForm } from '@/components/admin/ProjectForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'

type ProjectRow = Database['public']['Tables']['projects']['Row']

interface Props {
  params: Promise<{ id: string }>
}

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data, error }, { data: tagRows }] = await Promise.all([
    (supabase
      .from('projects') as any)
      .select('id, title, description, image_url, github_url, live_url, featured, sort_order')
      .eq('id', id)
      .single(),
    supabase
      .from('project_tech_tags')
      .select('name, sort_order')
      .eq('project_id', id)
      .order('sort_order'),
  ])

  const project = data as ProjectRow | null

  if (error || !project) notFound()

  const tech = (tagRows ?? []).map((t: { name: string; sort_order: number }) => t.name)

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-1">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent-cyan transition-colors"
        >
          <ChevronLeft size={13} /> Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">Edit Project</h1>
        <p className="text-text-muted text-sm">{project.title}</p>
      </div>

      <ProjectForm
        project={{
          id:          project.id,
          title:       project.title,
          description: project.description,
          tech,
          image_url:   project.image_url  ?? null,
          github_url:  project.github_url ?? null,
          live_url:    project.live_url   ?? null,
          featured:    project.featured,
          sort_order:  project.sort_order,
        }}
      />
    </div>
  )
}
