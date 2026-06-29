import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { GlassCard } from '@/components/ui/GlassCard'
import { DeleteProjectButton } from '@/components/admin/DeleteProjectButton'
import { Plus, Pencil, Star } from 'lucide-react'

interface ProjectRow {
  id: string; title: string; description: string
  featured: boolean; sort_order: number; image_url: string | null
  project_tech_tags: { name: string; sort_order: number }[]
}

export default async function AdminProjectsPage() {
  const supabase = await createClient()
  const { data: rawProjects, error } = await supabase
    .from('projects')
    .select('id, title, description, featured, sort_order, image_url, project_tech_tags(name, sort_order)')
    .order('sort_order')
  const projects = rawProjects as ProjectRow[] | null

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Projects</h1>
          <p className="text-text-muted text-sm mt-1">{projects?.length ?? 0} total</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-cyan text-bg-base font-semibold text-sm hover:bg-accent-cyan/90 transition-colors"
        >
          <Plus size={15} />
          New Project
        </Link>
      </div>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
          {error.message}
        </p>
      )}

      <div className="space-y-3">
        {projects?.length === 0 && (
          <GlassCard variant="default" className="text-center text-text-muted text-sm py-10">
            No projects yet. <Link href="/admin/projects/new" className="text-accent-cyan hover:underline">Create one →</Link>
          </GlassCard>
        )}

        {projects?.map(project => (
          <GlassCard key={project.id} variant="default" className="!p-4">
            <div className="flex items-start gap-4">
              {/* Order badge */}
              <div className="w-8 h-8 rounded-lg bg-bg-elevated flex items-center justify-center text-xs font-mono text-text-muted flex-shrink-0">
                {project.sort_order}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-text-primary text-sm">{project.title}</h3>
                  {project.featured && (
                    <span className="flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/25">
                      <Star size={9} />Featured
                    </span>
                  )}
                </div>
                <p className="text-text-muted text-xs mt-0.5 truncate">{project.description}</p>
                {project.project_tech_tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {project.project_tech_tags
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .slice(0, 5)
                      .map(t => (
                        <span key={t.name} className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 text-text-muted bg-bg-surface/60">
                          {t.name}
                        </span>
                      ))}
                    {project.project_tech_tags.length > 5 && (
                      <span className="text-[10px] text-text-muted">+{project.project_tech_tags.length - 5}</span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-text-secondary border border-white/10 hover:bg-bg-elevated transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </Link>
                <DeleteProjectButton id={project.id} title={project.title} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  )
}
