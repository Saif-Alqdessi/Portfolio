import { createClient } from '@/lib/supabase/server'
import { Github, Linkedin, Mail, MessageCircle, Link } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface SocialLink {
  platform: string
  url: string
  icon: string
  sort_order: number
}

const FALLBACK_LINKS: SocialLink[] = [
  { platform: 'github', url: 'https://github.com', icon: 'Github', sort_order: 0 },
  { platform: 'linkedin', url: 'https://linkedin.com', icon: 'Linkedin', sort_order: 1 },
  { platform: 'email', url: 'mailto:hello@example.com', icon: 'Mail', sort_order: 2 },
]

const FOOTER_NAV = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Stack', href: '#stack' },
]

function getIconComponent(iconName: string, platformName: string): LucideIcon {
  const normalizedPlatform = platformName.toLowerCase()
  
  // Try to use the provided icon name first
  if (iconName) {
    const normalizedIcon = iconName.toLowerCase()
    if (normalizedIcon === 'github') return Github
    if (normalizedIcon === 'linkedin') return Linkedin
    if (normalizedIcon === 'mail') return Mail
    if (normalizedIcon === 'messagecircle') return MessageCircle
  }
  
  // Fallback by platform name
  if (normalizedPlatform === 'github') return Github
  if (normalizedPlatform === 'linkedin') return Linkedin
  if (normalizedPlatform === 'email') return Mail
  if (normalizedPlatform === 'whatsapp') return MessageCircle
  
  // Final fallback
  return Link
}

function normalizeUrl(url: string, platform: string): string {
  const normalizedPlatform = platform.toLowerCase()
  
  if (normalizedPlatform === 'email') {
    const trimmedUrl = url.trim()
    if (trimmedUrl.toLowerCase().startsWith('mailto:')) {
      return trimmedUrl
    }
    // Check if it looks like an email (contains @ and no scheme)
    if (trimmedUrl.includes('@') && !trimmedUrl.includes('://')) {
      return `mailto:${trimmedUrl}`
    }
    return `mailto:${trimmedUrl}`
  }
  
  if (normalizedPlatform === 'whatsapp') {
    if (url.startsWith('+')) {
      const digits = url.replace(/\D/g, '')
      return `https://wa.me/${digits}`
    }
    if (url.startsWith('https://wa.me/')) {
      return url
    }
    const digits = url.replace(/\D/g, '')
    return `https://wa.me/${digits}`
  }
  
  return url
}

export async function Footer() {
  let name = 'Saif Alqdessi'
  let tagline = 'AI Engineer & Systems Architect'
  let links: SocialLink[] = FALLBACK_LINKS

  try {
    const supabase = await createClient()
    
    const { data: profile } = await supabase
      .from('profile')
      .select('name, tagline')
      .single() as any
    
    if (profile?.name) name = profile.name
    if (profile?.tagline) tagline = profile.tagline

    const { data: socialLinks, error } = await supabase
      .from('links')
      .select('*')
      .order('platform', { ascending: true })
    
    if (error) {
      console.error('Failed to fetch social links from Supabase:', error)
    } else if (socialLinks && socialLinks.length > 0) {
      links = socialLinks as SocialLink[]
    }
  } catch (err) {
    console.error('Error fetching footer data:', err)
  }

  return (
    <footer id="contact" className="py-16 sm:py-20 border-t border-white/5">
      <div className="max-w-6xl mx-auto px-6">
        
        <div className="flex flex-col items-center text-center space-y-8">
          
          {/* Name & tagline */}
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              {name}
            </h2>
            <p className="text-text-secondary text-base">
              {tagline}
            </p>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-6">
            {links.map((link) => {
              const normalizedPlatform = link.platform.toLowerCase()
              const Icon = getIconComponent(link.icon, link.platform)
              const isEmail = normalizedPlatform === 'email'
              const href = normalizeUrl(link.url, link.platform)
              
              return (
                <a
                  key={link.platform}
                  href={href}
                  target={isEmail ? undefined : '_blank'}
                  rel={isEmail ? undefined : 'noreferrer'}
                  className="group flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-bg-surface/60 hover:border-accent-cyan/50 hover:bg-accent-cyan/5 transition-all duration-300"
                >
                  <Icon 
                    size={18} 
                    className="text-text-muted group-hover:text-accent-cyan transition-colors" 
                  />
                </a>
              )
            })}
          </div>

          {/* Footer nav */}
          <nav className="flex items-center gap-8">
            {FOOTER_NAV.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-text-muted hover:text-accent-cyan transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Copyright */}
          <div className="pt-6 border-t border-white/5 w-full">
            <p className="text-xs text-text-muted">
              © {new Date().getFullYear()} {name}. Built with Next.js & Supabase.
            </p>
          </div>

        </div>
      </div>
    </footer>
  )
}

