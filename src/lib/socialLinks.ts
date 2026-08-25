import { Github, Linkedin, Mail, MessageCircle, Link } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface SocialLink {
  platform: string
  url: string
  icon: string
  sort_order: number
}

export const FALLBACK_LINKS: SocialLink[] = [
  { platform: 'github', url: 'https://github.com', icon: 'Github', sort_order: 0 },
  { platform: 'linkedin', url: 'https://linkedin.com', icon: 'Linkedin', sort_order: 1 },
  { platform: 'email', url: 'mailto:hello@example.com', icon: 'Mail', sort_order: 2 },
]

export function getIconComponent(iconName: string, platformName: string): LucideIcon {
  const normalizedPlatform = platformName.toLowerCase()

  if (iconName) {
    const normalizedIcon = iconName.toLowerCase()
    if (normalizedIcon === 'github') return Github
    if (normalizedIcon === 'linkedin') return Linkedin
    if (normalizedIcon === 'mail') return Mail
    if (normalizedIcon === 'messagecircle') return MessageCircle
  }

  if (normalizedPlatform === 'github') return Github
  if (normalizedPlatform === 'linkedin') return Linkedin
  if (normalizedPlatform === 'email') return Mail
  if (normalizedPlatform === 'whatsapp') return MessageCircle

  return Link
}

export function normalizeUrl(url: string, platform: string): string {
  const normalizedPlatform = platform.toLowerCase()

  if (normalizedPlatform === 'email') {
    const trimmedUrl = url.trim()
    if (trimmedUrl.toLowerCase().startsWith('mailto:')) return trimmedUrl
    if (trimmedUrl.includes('@') && !trimmedUrl.includes('://')) return `mailto:${trimmedUrl}`
    return `mailto:${trimmedUrl}`
  }

  if (normalizedPlatform === 'whatsapp') {
    if (url.startsWith('+')) return `https://wa.me/${url.replace(/\D/g, '')}`
    if (url.startsWith('https://wa.me/')) return url
    return `https://wa.me/${url.replace(/\D/g, '')}`
  }

  return url
}

export function platformLabel(platform: string): string {
  const p = platform.toLowerCase()
  if (p === 'github') return 'GitHub'
  if (p === 'linkedin') return 'LinkedIn'
  if (p === 'email') return 'Email'
  if (p === 'whatsapp') return 'WhatsApp'
  return platform.charAt(0).toUpperCase() + platform.slice(1)
}

export function platformDescription(platform: string): string {
  const p = platform.toLowerCase()
  if (p === 'github') return 'View my repositories'
  if (p === 'linkedin') return "Let's connect"
  if (p === 'email') return 'Get in touch directly'
  if (p === 'whatsapp') return 'Message me'
  return 'Connect with me'
}
