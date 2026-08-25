import { EventFlowVisual } from './EventFlowVisual'
import { HrInterviewerVisual } from './HrInterviewerVisual'
import { FinancialVisual } from './FinancialVisual'
import { TicketingVisual } from './TicketingVisual'
import type { VisualProps } from './shared'

type VisualComponent = (props: VisualProps) => React.ReactElement

// Matched by keyword against the real project title from Supabase, so a
// renamed or newly-added project falls through to its real photo instead
// of rendering the wrong (or a blank) micro-visual.
const VISUAL_MATCHERS: { keywords: string[]; Component: VisualComponent }[] = [
  { keywords: ['eventflow', 'photosort', 'smart event'], Component: EventFlowVisual },
  { keywords: ['hr interviewer', 'agentic hr'], Component: HrInterviewerVisual },
  { keywords: ['financial portfolio', 'portfolio manager'], Component: FinancialVisual },
  { keywords: ['ticketing', 'verification'], Component: TicketingVisual },
]

export function getProjectVisual(title: string): VisualComponent | null {
  const normalized = title.toLowerCase()
  const match = VISUAL_MATCHERS.find(({ keywords }) =>
    keywords.some((k) => normalized.includes(k))
  )
  return match ? match.Component : null
}
