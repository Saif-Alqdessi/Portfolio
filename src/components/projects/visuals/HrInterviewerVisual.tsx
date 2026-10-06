'use client'

import { ProjectVideo } from './ProjectVideo'
import type { VisualProps } from './shared'

export function HrInterviewerVisual(_props: VisualProps) {
  return (
    <ProjectVideo
      src="/projects/hr-interviewer.mp4"
      poster="/projects/hr-interviewer.jpg"
      label="Agentic HR Interviewer: a candidate's spoken claims stream to the AI interviewer, a verifier agent checks them against their history, and the interviewer follows up on the mismatch"
    />
  )
}
