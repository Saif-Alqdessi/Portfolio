import type { Metadata } from 'next'
import { Instagram, Facebook, Linkedin, MessageCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { GlassmorphismPortfolio } from '@/components/ui/glassmorphism-portfolio'
import { normalizeUrl, FALLBACK_LINKS } from '@/lib/socialLinks'
import type { SocialLink } from '@/lib/socialLinks'

const FALLBACK_NAME = 'Saif Alqdessi'
const FALLBACK_TAGLINE = 'AI Engineer & Systems Architect'
// The About page reads profile.bio, not profile.summary. `summary` is the
// Hero's sales pitch, aimed at the visitor; `bio` is written about Saif.
const FALLBACK_BIO =
  'I build AI systems that take over work people are currently doing by hand. In practice that means agents that plan and call their own tools, retrieval pipelines that answer from real documents instead of guessing, and the FastAPI and Next.js backends that keep all of it running once it leaves my machine.'
const COMMUNITY_PARAGRAPH =
  "I also run things outside the editor. I founded and chaired the IEEE Computer Society chapter at TTU with 30 volunteers, chaired the IMPACT conference for 300 participants with Ministry backing, and was named IEEE Region 8 Best Ambassador in 2023."
const FALLBACK_BLURB =
  'I like taking messy, manual processes and turning them into systems that just run themselves.'
const FALLBACK_PHOTO = '/img/Saif.jpg'
const FALLBACK_CV = '/cv.pdf'

const INSTAGRAM_URL = 'https://www.instagram.com/alqdessi'
const FACEBOOK_URL = 'https://www.facebook.com/syf.aldyn.alqdysy'

// `bio` is a single free-text field in Supabase. If it's written as multiple
// paragraphs (blank-line separated), respect that; otherwise treat it as one
// paragraph and follow it with the real community story.
function toBioParagraphs(bio: string): string[] {
  const parts = bio
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean)
  return parts.length > 0 ? parts : [bio]
}

export const metadata: Metadata = {
  title: 'About – Saif Alqdessi',
  description:
    'AI systems and agent engineer. I build autonomous agents, RAG pipelines, and the backends that run them in production.',
}

export default async function AboutPage() {
  let name = FALLBACK_NAME
  let tagline = FALLBACK_TAGLINE
  let bio = FALLBACK_BIO
  let photoUrl = FALLBACK_PHOTO
  let cvUrl = FALLBACK_CV
  let links: SocialLink[] = FALLBACK_LINKS

  try {
    const supabase = await createClient()
    const [{ data: profile }, { data: linkRows }] = await Promise.all([
      (supabase.from('profile') as any)
        .select('name, tagline, bio, photo_url, cv_url')
        .single(),
      supabase.from('links').select('*').order('platform', { ascending: true }),
    ])

    if (profile?.name) name = profile.name
    if (profile?.tagline) tagline = profile.tagline
    if (profile?.bio) bio = profile.bio
    if (profile?.photo_url) photoUrl = profile.photo_url
    if (profile?.cv_url) cvUrl = profile.cv_url

    if (linkRows && linkRows.length > 0) links = linkRows as SocialLink[]
  } catch {
    // fallbacks active
  }

  const linkedinRow = links.find((l) => l.platform.toLowerCase() === 'linkedin')
  const whatsappRow = links.find((l) => l.platform.toLowerCase() === 'whatsapp')

  const socialLinks = [
    {
      label: 'Instagram',
      description: 'Follow along',
      href: INSTAGRAM_URL,
      icon: <Instagram className="h-4 w-4" />,
      isEmail: false,
    },
    {
      label: 'Facebook',
      description: 'Connect with me',
      href: FACEBOOK_URL,
      icon: <Facebook className="h-4 w-4" />,
      isEmail: false,
    },
    {
      label: 'LinkedIn',
      description: linkedinRow ? "Let's connect" : 'Coming soon',
      href: linkedinRow ? normalizeUrl(linkedinRow.url, 'linkedin') : null,
      icon: <Linkedin className="h-4 w-4" />,
      isEmail: false,
    },
    {
      label: 'WhatsApp',
      description: whatsappRow ? 'Message me' : 'Coming soon',
      href: whatsappRow ? normalizeUrl(whatsappRow.url, 'whatsapp') : null,
      icon: <MessageCircle className="h-4 w-4" />,
      isEmail: false,
    },
  ]

  return (
    <GlassmorphismPortfolio
      name={name}
      tagline={tagline}
      bioParagraphs={[...toBioParagraphs(bio), COMMUNITY_PARAGRAPH]}
      blurb={FALLBACK_BLURB}
      photoUrl={photoUrl}
      socialLinks={socialLinks}
      ctaHref={cvUrl}
      ctaLabel="Download Resume"
    />
  )
}
