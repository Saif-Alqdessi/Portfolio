// Responsive audit: walks every supported breakpoint on every route and
// reports elements that overflow their container, undersized touch targets,
// and inputs small enough to trigger iOS zoom.
//
//   node scripts/audit-responsive.mjs [baseUrl]
//
// Requires a running dev server (default http://localhost:3000).
import { chromium } from 'playwright'

const BASE = process.argv[2] || 'http://localhost:3000'
const ROUTES = ['/', '/about', '/projects', '/admin/login']
const THEMES = ['dark', 'light']
const VIEWPORTS = [
  { w: 375, h: 812, name: 'iPhone SE' },
  { w: 390, h: 844, name: 'iPhone 14/15' },
  { w: 412, h: 915, name: 'Android' },
  { w: 480, h: 800, name: 'Phone landscape' },
  { w: 768, h: 1024, name: 'iPad portrait' },
  { w: 900, h: 1200, name: 'iPad landscape' },
  { w: 1280, h: 800, name: 'Laptop' },
  { w: 1920, h: 1080, name: 'Desktop' },
]

// Runs in page context. Compares against documentElement width so we catch
// elements pushing the page wide, not merely ones with internal scroll.
function collect(opts) {
  const { checkTargets } = opts
  const docWidth = document.documentElement.clientWidth
  const out = { overflow: [], smallTargets: [], smallInputs: [], docWidth, scrollWidth: document.documentElement.scrollWidth }

  // An element inside an overflow-hidden/scroll ancestor is clipped and cannot
  // widen the page. Marquee tracks and carousels live here legitimately.
  const isClipped = (el) => {
    let p = el.parentElement
    while (p && p !== document.documentElement) {
      const ox = getComputedStyle(p).overflowX
      if (ox === 'hidden' || ox === 'clip' || ox === 'auto' || ox === 'scroll') return true
      p = p.parentElement
    }
    return false
  }

  const label = (el) => {
    const cls = typeof el.className === 'string' ? el.className.trim().split(/\s+/).slice(0, 4).join(' ') : ''
    return `${el.tagName.toLowerCase()}${cls ? '.' + cls.replace(/\s+/g, '.') : ''}`
  }

  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect()
    if (r.width === 0 && r.height === 0) continue

    // Element extends past the right edge of the document.
    const past = Math.round(r.right - docWidth)
    if (past > 1) {
      const style = getComputedStyle(el)
      // Ignore decorative layers and anything a scroll container clips.
      if (style.position !== 'fixed' && style.pointerEvents !== 'none' && !isClipped(el)) {
        out.overflow.push({ el: label(el), pastRight: past, width: Math.round(r.width) })
      }
    }

    // Touch targets only matter on touch viewports; a 20px text link is
    // normal with a mouse. 44px is the Apple/WCAG-AAA bar.
    if (checkTargets && el.matches('a, button, [role="button"], input[type="checkbox"], input[type="radio"]')) {
      // 24px is the WCAG 2.2 AA floor (2.5.8) and a hard fail. 44px is the
      // Apple/AAA target: reported as a warning, since dense grouped controls
      // (pagination dots) physically cannot reach it at 375px.
      if (r.width > 0 && el.offsetParent !== null && (r.width < 44 || r.height < 44)) {
        const fails = r.width < 24 || r.height < 24
        out.smallTargets.push({ el: label(el), w: Math.round(r.width), h: Math.round(r.height), fails })
      }
    }

    // iOS only zooms on focus for touch devices, so this is a mobile rule.
    if (checkTargets && el.matches('input, select, textarea')) {
      const fs = parseFloat(getComputedStyle(el).fontSize)
      if (fs < 16) out.smallInputs.push({ el: label(el), fontSize: fs })
    }
  }

  // Deduplicate by label, keeping the worst offender.
  const dedupe = (arr, key) => {
    const m = new Map()
    for (const item of arr) {
      const prev = m.get(item.el)
      if (!prev || item[key] > prev[key]) m.set(item.el, item)
    }
    return [...m.values()].sort((a, b) => b[key] - a[key])
  }

  out.overflow = dedupe(out.overflow, 'pastRight').slice(0, 12)
  out.smallTargets = dedupe(out.smallTargets, 'w').slice(0, 12)
  out.smallInputs = dedupe(out.smallInputs, 'fontSize').slice(0, 8)
  return out
}

const browser = await chromium.launch()
let totalIssues = 0

for (const route of ROUTES) {
 for (const theme of THEMES) {
  console.log(`\n${'='.repeat(64)}\n  ${route}  [${theme}]\n${'='.repeat(64)}`)

  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({
      viewport: { width: vp.w, height: vp.h },
      deviceScaleFactor: 2,
      isMobile: vp.w < 768,
      hasTouch: vp.w < 768,
    })
    // next-themes reads this before paint, so the page renders in-theme.
    await ctx.addInitScript((t) => { try { localStorage.setItem('theme', t) } catch {} }, theme)
    const page = await ctx.newPage()
    try {
      await page.goto(BASE + route, { waitUntil: 'networkidle', timeout: 45000 })
      await page.waitForTimeout(600) // let entrance animations settle

      // Exercise the card deck's other layouts, which the default view hides.
      if (route === '/') {
        for (const mode of ['Switch to grid layout', 'Switch to list layout']) {
          const btn = page.getByRole('button', { name: mode })
          if (await btn.count()) {
            await btn.first().click({ timeout: 3000 }).catch(() => {})
            await page.waitForTimeout(450)
            const sub = await page.evaluate(collect, { checkTargets: vp.w < 768 })
            for (const o of sub.overflow) {
              console.log(`         FAIL overflow  +${o.pastRight}px  ${o.el}  [${mode.split(' ')[2]} layout]`)
              totalIssues++
            }
          }
        }
        const stackBtn = page.getByRole('button', { name: 'Switch to stack layout' })
        if (await stackBtn.count()) await stackBtn.first().click({ timeout: 3000 }).catch(() => {})
        await page.waitForTimeout(400)
      }

      const r = await page.evaluate(collect, { checkTargets: vp.w < 768 })

      const horizontallyScrolls = r.scrollWidth - r.docWidth > 1
      const warns = r.smallTargets.filter((t) => !t.fails)
      const fails =
        r.overflow.length +
        r.smallTargets.filter((t) => t.fails).length +
        r.smallInputs.length +
        (horizontallyScrolls ? 1 : 0)
      totalIssues += fails

      const status = fails ? `${fails} FAIL` : warns.length ? `clean (${warns.length} warn)` : 'clean'
      console.log(`  ${String(vp.w).padStart(4)}px ${vp.name.padEnd(17)} ${status}`)

      if (horizontallyScrolls) {
        console.log(`         PAGE SCROLLS: doc ${r.docWidth} vs scroll ${r.scrollWidth} (+${r.scrollWidth - r.docWidth}px)`)
      }
      for (const o of r.overflow) console.log(`         FAIL overflow  +${o.pastRight}px  ${o.el}  (w=${o.width})`)
      for (const t of r.smallTargets.filter((t) => t.fails)) console.log(`         FAIL target    ${t.w}x${t.h}  ${t.el}`)
      for (const i of r.smallInputs) console.log(`         FAIL input     ${i.fontSize}px  ${i.el}`)
      for (const t of warns) console.log(`         warn target    ${t.w}x${t.h} (under 44, over WCAG AA 24)  ${t.el}`)
    } catch (err) {
      console.log(`  ${String(vp.w).padStart(4)}px ${vp.name.padEnd(17)} ERROR: ${err.message.split('\n')[0]}`)
    } finally {
      await ctx.close()
    }
  }
 }
}

await browser.close()
console.log(`\n${totalIssues === 0 ? 'PASS: no issues found.' : `TOTAL ISSUES: ${totalIssues}`}\n`)
