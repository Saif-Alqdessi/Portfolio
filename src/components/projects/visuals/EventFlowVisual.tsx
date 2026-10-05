'use client'

import { ProjectVideo } from './ProjectVideo'
import type { VisualProps } from './shared'

export function EventFlowVisual(_props: VisualProps) {
  return (
    <ProjectVideo
      src="/projects/eventflow-ai.mp4"
      poster="/projects/eventflow-ai.jpg"
      label="EventFlow AI: event photos are scanned for faces, restored, embedded and sorted into one stack per person"
    />
  )
}
