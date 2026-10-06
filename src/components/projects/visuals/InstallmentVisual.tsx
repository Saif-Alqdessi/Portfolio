'use client'

import { ProjectVideo } from './ProjectVideo'
import type { VisualProps } from './shared'

export function InstallmentVisual(_props: VisualProps) {
  return (
    <ProjectVideo
      src="/projects/installment-dashboard.mp4"
      poster="/projects/installment-dashboard.jpg"
      label="Installment & Subscription Dashboard: a contract is priced and split into exact monthly installments, a missed payment flips it to overdue, and fund metrics update with 200+ tests guarding the math"
    />
  )
}
