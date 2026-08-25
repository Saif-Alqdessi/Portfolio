import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { ShiningText } from '@/components/ui/shining-text'
import { getIconComponent, normalizeUrl, platformLabel, FALLBACK_LINKS } from '@/lib/socialLinks'
import type { SocialLink } from '@/lib/socialLinks'

// Next signals "this route cannot be rendered statically" by throwing an error
// carrying this digest. Swallowing it in a catch hides that signal from the
// framework and prints a scary-looking error on every build. Re-throw it and
// let Next mark the route dynamic; genuine Supabase failures still fall
// through to the fallbacks below.
function rethrowIfDynamicServerUsage(err: unknown): void {
  if (
    typeof err === 'object' &&
    err !== null &&
    'digest' in err &&
    (err as { digest?: unknown }).digest === 'DYNAMIC_SERVER_USAGE'
  ) {
    throw err
  }
}

const EXPLORE_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About Me', href: '/about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Contact Me', href: '/#contact' },
]

// Kept to just the professional network — this footer is read by recruiters
// and technical visitors closing out the page, not the full personal set
// shown on the About page.
const CONNECT_PLATFORMS = ['linkedin', 'github']

export async function Footer() {
  let links: SocialLink[] = FALLBACK_LINKS

  try {
    const supabase = await createClient()

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
    rethrowIfDynamicServerUsage(err)
    console.error('Error fetching footer data:', err)
  }

  const connectLinks = links.filter((l) => CONNECT_PLATFORMS.includes(l.platform.toLowerCase()))
  const year = new Date().getFullYear()

  return (
    <footer id="contact" className="w-full border-t border-foreground/10 bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 md:px-10">
        <ScrollReveal direction="up">
          <div className="grid gap-12 md:grid-cols-[1.4fr_auto_auto] md:gap-16">
            {/* Sign-off */}
            <div className="flex flex-col items-start gap-4">
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-text-primary md:text-5xl">
                Let&apos;s build together.
              </h2>

              <ShiningText
                text="Open to AI Engineer roles, Amman or remote."
                className="text-sm font-medium sm:text-base"
              />

              <a
                href="#get-started"
                className="group mt-2 inline-flex items-center gap-2 rounded-full bg-accent-purple px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors duration-200 hover:bg-accent-purple-dim"
              >
                Start a project
                <ArrowUpRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>

            {/* Explore + Connect sit side by side on phones instead of
                stacking into one tall column. `md:contents` dissolves this
                wrapper at desktop so both columns become direct children of
                the outer 3-column grid again. */}
            <div className="grid grid-cols-2 gap-8 md:contents">

            {/* Explore */}
            <div>
              <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-text-muted">
                Explore
              </p>
              <ul className="space-y-3">
                {EXPLORE_LINKS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="-mx-2 inline-flex min-h-[2.75rem] min-w-[2.75rem] items-center px-2 text-sm text-text-secondary transition-colors hover:text-accent-purple sm:mx-0 sm:min-h-0 sm:min-w-0 sm:px-0"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect */}
            <div>
              <p className="mb-4 font-mono text-[11px] font-semibold uppercase tracking-[0.25em] text-text-muted">
                Connect
              </p>
              <ul className="space-y-3">
                {connectLinks.map((link) => {
                  const Icon = getIconComponent(link.icon, link.platform)
                  const href = normalizeUrl(link.url, link.platform)
                  return (
                    <li key={link.platform}>
                      <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex min-h-[2.75rem] items-center gap-2 text-sm text-text-secondary transition-colors hover:text-accent-purple sm:min-h-0"
                      >
                        <Icon size={15} strokeWidth={1.75} />
                        {platformLabel(link.platform)}
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 transition-opacity group-hover:opacity-100"
                        />
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>

            </div>
          </div>
        </ScrollReveal>

        {/* Copyright */}
        <div className="mt-16 flex flex-col items-center border-t border-foreground/10 pt-8 text-center">
          <p className="font-mono text-xs text-text-muted">
            © {year} • Built and maintained by me
          </p>
        </div>
      </div>
    </footer>
  )
}
