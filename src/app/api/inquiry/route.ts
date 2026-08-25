import { NextResponse } from 'next/server'
import { Resend } from 'resend'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

interface InquiryPayload {
  name?: unknown
  email?: unknown
  phone?: unknown
  website?: unknown
  role?: unknown
  services?: unknown
  timeline?: unknown
  challenge?: unknown
  budget?: unknown
}

const isNonEmptyString = (v: unknown): v is string =>
  typeof v === 'string' && v.trim().length > 0

/**
 * Escapes unsafe characters for safe interpolation into HTML.
 */
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Renders a single labelled detail row, or a muted placeholder when absent.
 */
function detailRow(label: string, value: string | undefined): string {
  const safe = value && value.trim() ? escapeHtml(value.trim()) : '<span style="color:#94a3b8">—</span>'
  return `
    <tr>
      <td style="padding:6px 0;vertical-align:top;width:180px;color:#94a3b8;font-size:13px;font-family:Inter,Arial,sans-serif;">${label}</td>
      <td style="padding:6px 0;vertical-align:top;color:#f8fafc;font-size:14px;font-family:Inter,Arial,sans-serif;">${safe}</td>
    </tr>`
}

export async function POST(request: Request) {
  let payload: InquiryPayload
  try {
    payload = (await request.json()) as InquiryPayload
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 })
  }

  // --- Validate required fields -------------------------------------------------
  if (!isNonEmptyString(payload.name)) {
    return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  }
  if (!isNonEmptyString(payload.email) || !EMAIL_RE.test(payload.email.trim())) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }
  if (!isNonEmptyString(payload.role)) {
    return NextResponse.json({ error: 'Job title / role is required.' }, { status: 400 })
  }
  if (!isNonEmptyString(payload.challenge)) {
    return NextResponse.json({ error: 'Primary business challenge is required.' }, { status: 400 })
  }
  if (!isNonEmptyString(payload.budget)) {
    return NextResponse.json({ error: 'Estimated budget is required.' }, { status: 400 })
  }
  if (
    !Array.isArray(payload.services) ||
    payload.services.length === 0 ||
    !payload.services.every(isNonEmptyString)
  ) {
    return NextResponse.json({ error: 'At least one service of interest is required.' }, { status: 400 })
  }

  // --- Configuration ------------------------------------------------------------
  const apiKey = process.env.RESEND_API_KEY
  const contactEmail = process.env.CONTACT_EMAIL

  if (!apiKey || !contactEmail) {
    console.error('[/api/inquiry] Missing RESEND_API_KEY or CONTACT_EMAIL environment variable.')
    return NextResponse.json({ error: 'Email delivery is not configured.' }, { status: 500 })
  }

  // --- Build email --------------------------------------------------------------
  const services = (payload.services as string[]).join(', ')
  const subject = `New Project Inquiry — ${payload.name}`
  const replyTo = payload.email.trim()

  const rows = [
    detailRow('Name', payload.name),
    detailRow('Email', payload.email),
    detailRow('Phone', isNonEmptyString(payload.phone) ? payload.phone : undefined),
    detailRow('Website', isNonEmptyString(payload.website) ? payload.website : undefined),
    detailRow('Role', payload.role),
    detailRow('Services', services),
    detailRow('Timeline', isNonEmptyString(payload.timeline) ? payload.timeline : undefined),
    detailRow('Budget', payload.budget),
  ].join('')

  const html = `
<!DOCTYPE html>
<html lang="en">
  <body style="margin:0;padding:0;background-color:#0c0a09;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0c0a09;">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#1c1917;border:1px solid rgba(255,255,255,0.08);border-radius:16px;overflow:hidden;">
            <tr>
              <td style="padding:28px 32px;border-bottom:1px solid rgba(255,255,255,0.08);">
                <p style="margin:0 0 4px;font-family:Inter,Arial,sans-serif;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#f97316;font-weight:600;">New Inquiry</p>
                <h1 style="margin:0;font-family:Inter,Arial,sans-serif;font-size:22px;color:#f8fafc;font-weight:700;">Project Inquiry from ${escapeHtml(payload.name)}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 8px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;">
                <p style="margin:0 0 6px;font-family:Inter,Arial,sans-serif;font-size:13px;color:#94a3b8;">Primary business challenge</p>
                <p style="margin:0;padding:16px;background-color:#292524;border:1px solid rgba(255,255,255,0.06);border-radius:12px;font-family:Inter,Arial,sans-serif;font-size:14px;color:#f8fafc;line-height:1.6;white-space:pre-wrap;">${escapeHtml(payload.challenge)}</p>
              </td>
            </tr>
          </table>
          <p style="margin:24px 0 0;font-family:Inter,Arial,sans-serif;font-size:12px;color:#475569;">This inquiry was submitted from the website contact form.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`

  // --- Send via Resend ----------------------------------------------------------
  const resend = new Resend(apiKey)
  try {
    const { error } = await resend.emails.send({
      from: 'Website Inquiry <onboarding@resend.dev>',
      to: contactEmail,
      replyTo,
      subject,
      html,
    })

    if (error) {
      console.error('[/api/inquiry] Resend error:', error)
      return NextResponse.json({ error: 'Failed to send inquiry email.' }, { status: 502 })
    }

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: unknown) {
    console.error('[/api/inquiry] Unexpected error:', err)
    return NextResponse.json({ error: 'Failed to send inquiry email.' }, { status: 500 })
  }
}
