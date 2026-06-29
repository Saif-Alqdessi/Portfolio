'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'

interface Props {
  action: () => Promise<{ error?: string }>
  label?: string
}

export function AdminDeleteBtn({ action, label = 'this item' }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleClick() {
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return
    setLoading(true)
    const result = await action()
    if (result?.error) {
      alert(result.error)
      setLoading(false)
    } else {
      router.refresh()
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-red-400 border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 disabled:opacity-50 transition-colors"
    >
      <Trash2 size={12} />
      {loading ? 'Deleting…' : 'Delete'}
    </button>
  )
}
