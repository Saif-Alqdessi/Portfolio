'use client'

import { ProjectVideo } from './ProjectVideo'
import type { VisualProps } from './shared'

export function FinancialVisual(_props: VisualProps) {
  return (
    <ProjectVideo
      src="/projects/financial-portfolio.mp4"
      poster="/projects/financial-portfolio.jpg"
      label="Financial Portfolio Manager: row-level security isolates each tenant, a principal splits across shared investors to exactly 100%, and the dashboard flips between English and Arabic"
    />
  )
}
