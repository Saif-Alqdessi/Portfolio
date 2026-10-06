'use client'

import { ProjectVideo } from './ProjectVideo'
import type { VisualProps } from './shared'

export function TicketingVisual(_props: VisualProps) {
  return (
    <ProjectVideo
      src="/projects/ticketing.mp4"
      poster="/projects/ticketing.jpg"
      label="Automated Ticketing & Verification: spreadsheet rows become emailed QR passes, a gate scan validates in under 100 ms and rejects a second scan, and check-ins stream to a live queue"
    />
  )
}
