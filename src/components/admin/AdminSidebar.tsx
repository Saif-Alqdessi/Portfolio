'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { signOut } from '@/app/admin/actions'
import {
  LayoutDashboard, FolderOpen, User, Briefcase,
  BarChart2, Code2, GitBranch, LogOut, Link2, Type,
} from 'lucide-react'

const NAV = [
  { label: 'Dashboard', href: '/admin',          icon: LayoutDashboard },
  { label: 'Projects',  href: '/admin/projects',  icon: FolderOpen },
  { label: 'Profile',   href: '/admin/profile',   icon: User },
  { label: 'Links',     href: '/admin/links',     icon: Link2 },
  { label: 'Titles',    href: '/admin/titles',    icon: Type },
  { label: 'Services',  href: '/admin/services',  icon: Briefcase },
  { label: 'Stats',     href: '/admin/stats',     icon: BarChart2 },
  { label: 'Skills',    href: '/admin/skills',    icon: Code2 },
  { label: 'Approach',  href: '/admin/approach',  icon: GitBranch },
]

export function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex-shrink-0 min-h-screen bg-bg-surface/80 border-r border-white/5 flex flex-col">
      {/* Brand */}
      <div className="p-5 border-b border-white/5">
        <span className="text-accent-cyan font-bold text-sm font-mono tracking-wide">
          Admin Panel
        </span>
        <p className="text-text-muted text-xs mt-0.5 truncate">{userEmail}</p>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                active
                  ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20'
                  : 'text-text-secondary hover:bg-bg-elevated hover:text-text-primary'
              )}
            >
              <Icon size={15} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-3 border-t border-white/5">
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-text-secondary hover:bg-red-500/10 hover:text-red-400 transition-colors"
          >
            <LogOut size={15} />
            Logout
          </button>
        </form>
      </div>
    </aside>
  )
}
