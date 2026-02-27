import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin — Portfolio' }

export default function AdminBaseLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base text-text-primary font-sans antialiased">
      {children}
    </div>
  )
}
