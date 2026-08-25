import { createClient } from '@/lib/supabase/server'
import { ArrowUpRight } from 'lucide-react'
import type { Database } from '@/lib/supabase/types'
import { AnimatedRoles } from '@/components/ui/animated-roles'
import { ShiningText } from '@/components/ui/shining-text'

type TitleRow = Database['public']['Tables']['titles']['Row']
type ProfileRow = Database['public']['Tables']['profile']['Row']

const FALLBACK_TITLES = [
  'Autonomous AI Agents',
  'Automated Workflows',
  'Full-Stack Web Apps',
  'Custom AI Chatbots',
  'Business AI Assistants',
]
// The Hero shows profile.summary (the pitch aimed at the visitor), NOT
// profile.bio, which is the About page's first-person biography.
const FALLBACK_PITCH =
  "I turn operational bottlenecks into autonomous AI systems that handle the busywork, so you don't have to."

export async function HeroSection() {
  let titles = FALLBACK_TITLES
  let pitch = FALLBACK_PITCH

  try {
    const supabase = await createClient()
    const [titlesRes, profileRes] = await Promise.all([
      (supabase.from('titles') as any).select('title').order('sort_order'),
      (supabase.from('profile') as any).select('summary').single(),
    ])
    const titleRows = titlesRes.data as TitleRow[] | null
    const profile = profileRes.data as ProfileRow | null

    if (titleRows && titleRows.length > 0) {
      titles = titleRows.map((t) => t.title)
    }
    if (profile?.summary) {
      pitch = profile.summary
    }
  } catch {
    // fallbacks active
  }

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden border-b border-white/10 bg-[#050505] text-white p-0 m-0">
      {/* Background photo — full-bleed, full opacity, no fade. The Hero is
          a fixed dark cinematic canvas independent of the site's light/dark
          toggle (its text is already hardcoded white for the same reason),
          so the dark photo sits on a dark section background with nothing
          to fade into — no mask, no gradient, no compositing math that can
          produce a grey transition zone. The border-b above is the only,
          deliberate seam into the next (theme-aware) section. */}
      {/* Art direction, not one image scaled two ways. The landscape source is
          2.06:1, so a portrait phone crops it to a sliver and cuts the subject
          in half. Under 768px the browser fetches a portrait crop instead.
          Plain <picture> rather than next/image because next/image cannot swap
          sources per breakpoint, and hiding a second <Image> with CSS still
          downloads it (1.6MB) on mobile. WebP first, PNG as fallback. */}
      <div className="absolute -inset-[2px] pointer-events-none">
        <picture>
          <source media="(max-width: 767px)" srcSet="/img/HeroSec-portrait.webp" type="image/webp" />
          <source media="(max-width: 767px)" srcSet="/img/HeroSec-portrait.png" type="image/png" />
          <source srcSet="/img/HeroSec.webp" type="image/webp" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/img/HeroSec.png"
            alt=""
            fetchPriority="high"
            decoding="async"
            /* The portrait source sits the subject at ~65% across, so plain
               object-center pushes the face to ~78% of a 375px viewport.
               80% recentres it to ~53%, keeping looking-room on the left. */
            className="h-full w-full object-cover object-[80%_center] md:object-[center_75%]"
          />
        </picture>
      </div>

      {/* Hook + CTA — the only width-constrained layer on this section */}
      {/* On phones the portrait crop puts the face in the upper half, so the
          copy sits low rather than centred over it. */}
      <div className="relative z-10 flex h-full w-full flex-col justify-end px-6 pb-20 sm:justify-start sm:pb-0 sm:pt-[38vh]">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-md space-y-4 sm:max-w-lg">
            <AnimatedRoles roles={titles} />

            <ShiningText
              text={pitch}
              className="text-lg font-medium leading-snug [text-shadow:0_2px_20px_rgba(0,0,0,0.5)] sm:text-xl"
            />

            <a
              href="#get-started"
              className="group inline-flex items-center gap-3 rounded-full border border-white/30 py-2 pl-6 pr-2 text-sm font-semibold text-white backdrop-blur-sm transition-colors duration-200 hover:border-accent-cyan/70"
            >
              Start Your Project
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-bg-base transition-transform duration-200 group-hover:rotate-45">
                <ArrowUpRight size={16} strokeWidth={2.5} />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
