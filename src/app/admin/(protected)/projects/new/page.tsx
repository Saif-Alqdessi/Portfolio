import { ProjectForm } from '@/components/admin/ProjectForm'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default function NewProjectPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-1">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-accent-cyan transition-colors"
        >
          <ChevronLeft size={13} /> Back to Projects
        </Link>
        <h1 className="text-2xl font-bold text-text-primary">New Project</h1>
      </div>

      <ProjectForm />
    </div>
  )
}
