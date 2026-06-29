'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteLink } from './actions'
import { LinkForm } from '@/components/admin/LinkForm'
import { ExternalLink, Trash2 } from 'lucide-react'

interface Link {
  id: string
  platform: string
  url: string
  icon: string
}

interface Props {
  links: Link[]
}

export function LinksClient({ links }: Props) {
  const router = useRouter()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDelete(id: string, platform: string) {
    setDeleting(id)
    setError(null)
    const result = await deleteLink(id)
    setDeleting(null)
    if (result?.error) {
      setError(result.error)
    } else {
      router.refresh()
    }
  }

  return (
    <>
      {links.map((link) => (
        <tr key={link.id} className="hover:bg-white/5 transition-colors">
          <td className="px-4 py-3">
            <span className="text-text-primary text-sm font-medium">{link.platform}</span>
          </td>
          <td className="px-4 py-3">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent-cyan text-sm hover:underline flex items-center gap-1.5 max-w-xs truncate"
            >
              <span className="truncate">{link.url}</span>
              <ExternalLink size={12} className="flex-shrink-0" />
            </a>
          </td>
          <td className="px-4 py-3">
            <span className="text-text-secondary text-sm font-mono">{link.icon}</span>
          </td>
          <td className="px-4 py-3">
            <div className="flex items-center justify-end gap-2">
              <LinkForm link={link} />
              <button
                onClick={() => handleDelete(link.id, link.platform)}
                disabled={deleting === link.id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-text-secondary border border-white/10 bg-white/5 hover:bg-white/10 disabled:opacity-50 transition-colors"
              >
                <Trash2 size={12} />
                {deleting === link.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </td>
        </tr>
      ))}
      {error && (
        <tr>
          <td colSpan={4} className="px-4 py-3">
            <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          </td>
        </tr>
      )}
    </>
  )
}
