# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (Next.js, http://localhost:3000)
npm run build    # production build
npm run start    # run the production build
npm run lint     # next lint (eslint-config-next)
```

There is no test framework configured in this repo (no test script, no Jest/Vitest/Playwright config).

Required env vars (see `.env.local.example`): `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `RESEND_API_KEY`, `CONTACT_EMAIL`.

## Architecture

This is a single-page Next.js (App Router) portfolio site with a CMS-style admin backend, backed by Supabase (Postgres + Auth + Storage).

**Two halves of the app:**
- `src/app/page.tsx` — the public one-page site. It composes section components in order (`src/components/sections/*`): Hero → Track Record → About → What I Do → Projects → Engineering Approach → Tech Stack → Inquiry. `Navbar`/`Footer`/`BackgroundBlobs` live in `src/components/layout/` and wrap everything from `src/app/layout.tsx`.
- `src/app/admin/` — a password-protected CMS for editing the content shown above. `src/app/admin/(protected)/` is a route group gated by `src/app/admin/(protected)/layout.tsx` (redirects to `/admin/login` if no Supabase session). Each editable content type has its own route (`profile`, `titles`, `services`, `approach`, `skills`, `projects`, `links`, `stats`), each with a `page.tsx` (server-rendered list), a `client.tsx` (interactive UI), and an `actions.ts` (Next.js Server Actions doing the Supabase writes + `revalidatePath`).

**Content is data-driven with hardcoded fallbacks.** Every public section component (`AboutSection`, `WhatIDoSection`, `ProjectsSection`, etc.) is an async Server Component that tries to fetch its content from a Supabase table, and falls back to an inline `FALLBACK_*` constant if the query throws or returns empty. This means the file you're editing may not match what's live — check the Supabase table content (via the admin UI or `supabase/schema.sql`) before assuming a fallback constant is the actual displayed copy. See `SITE_CONTENT.md` for a full extraction of current copy/fallbacks per section.

**Supabase schema drift:** `supabase/schema.sql` is the original seed/schema script, but the live schema has since diverged — e.g. `ProjectsSection.tsx` and the projects admin actions (`src/app/admin/(protected)/projects/actions.ts`) query a `project_tech_tags` join table and use `image_url` backed by a `project-images` storage bucket, none of which exist in `schema.sql` (which instead has a `tech text[]` column on `projects`). Don't treat `schema.sql` as authoritative for the current DB shape — check `src/lib/supabase/types.ts` (`Database` type) instead, and update `schema.sql` when making schema changes if you want it to stay useful.

**Supabase client pattern:** three separate client constructors, pick the right one:
- `src/lib/supabase/server.ts` — `createClient()` for Server Components/Server Actions (cookie-based, via `@supabase/ssr`).
- `src/lib/supabase/client.ts` — `createClient()` for Client Components (e.g. `admin/login`).
- `src/middleware.ts` — builds its own server client to refresh the session and gate `/admin/*` routes (redirects unauthenticated users to `/admin/login`, redirects authenticated users away from `/admin/login`). Auth is Supabase email/password (`signInWithPassword`); there's no public signup flow — accounts are created directly in Supabase.

**Inquiry form → email, not DB.** `InquirySection.tsx` posts to `src/app/api/inquiry/route.ts`, which validates the payload and sends a formatted HTML email via Resend (`RESEND_API_KEY`/`CONTACT_EMAIL`) — it does not write to Supabase.

**Styling:** Tailwind CSS with a custom dark/neon design system defined in `tailwind.config.ts` (`bg.*`, `accent.cyan`/`accent.purple`, `text.*` color tokens, `glass`/`glow-cyan`/`glow-purple` box-shadows, `fade-up`/`blob` animations). Reusable primitives live in `src/components/ui/` (`GlassCard`, `NeonIcon`, `CTAButton`, `SectionHeader`, `ScrollReveal`, etc.) — prefer these over ad-hoc styling when building new sections.

**Path alias:** `@/*` maps to `src/*` (see `tsconfig.json`).

## Mobile responsiveness rules

Non-negotiable constraints for any UI work in this repo. Verify against them before calling a UI change done.

**Breakpoints:** 375, 390, 412, 480 (phones) / 768, 900 (tablet) / 1280, 1920 (desktop). Tailwind's `sm/md/lg/xl` map onto these; 375px is the narrowest supported width.

**Mobile-first only.** Write the base style for mobile and add `min-width` breakpoints upward (`sm:`, `md:`). Never start from desktop and walk down with `max-*` overrides.

**Hard rules**
- Touch targets: 44x44px for standalone controls (nav links, icon buttons, chips). 24x24px is the absolute floor (WCAG 2.2 AA 2.5.8) and only acceptable for dense grouped controls that cannot fit 44px at 375px, such as carousel dots. Both rules apply to touch widths only; a 20px text link is fine with a mouse.
- Form inputs are at least 16px (`text-base`) at touch widths. Anything smaller triggers automatic zoom on iOS focus. `text-sm` alone on an `<input>`/`<select>`/`<textarea>` is a bug; `text-base sm:text-sm` is the fix.
- No horizontal scroll at any supported width. `html`/`body` carry `overflow-x: hidden`, but that hides the symptom, so fix the offending element too.
- Fixed widths wider than 343px (375 minus padding) must be wrapped in a `max-w-full` or given a responsive base. `w-96`, `w-[28rem]` and similar are desktop-only values: put them behind `sm:`/`md:`.
- `min-w-0` on flex children that contain text. Without it a long string forces the parent wider than the viewport.
- Fluid type via `clamp()` rather than a ladder of breakpoint font sizes.
- Images and media get `max-width: 100%`.
- Respect `prefers-reduced-motion`; this repo already uses `motion-reduce:` and `useReducedMotion()`.

**Auditing.** `scripts/audit-responsive.mjs` drives Playwright across every breakpoint and reports overflowing elements with exact pixel counts. Run `node scripts/audit-responsive.mjs` against a running dev server. Zero overflow at all eight widths is the bar. Playwright MCP is also configured for one-off interactive checks.

**Done means:** no horizontal scroll, touch targets >= 44px, no input under 16px, correct viewport meta, body text >= 16px, images capped at 100% width, both themes checked, reduced motion respected.
