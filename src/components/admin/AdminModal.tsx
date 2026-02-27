'use client'

import { X } from 'lucide-react'

interface Props {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function AdminModal({ open, onClose, title, children }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-lg bg-bg-surface border border-white/10 rounded-xl shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5 flex-shrink-0">
          <h2 className="font-semibold text-text-primary text-sm">{title}</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 overflow-y-auto">{children}</div>
      </div>
    </div>
  )
}
