'use client'

import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Sparkles, Bot, Zap, Database } from 'lucide-react'

interface DisplayCardProps {
  className?: string
  icon?: ReactNode
  title?: ReactNode
  description?: string
  date?: string
  iconClassName?: string
  titleClassName?: string
  style?: CSSProperties
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-accent-purple" />,
  title = 'Featured',
  description = 'Discover amazing content',
  date,
  iconClassName,
  titleClassName = 'text-accent-purple',
  style,
}: DisplayCardProps) {
  return (
    <div
      style={style}
      className={cn(
        "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 border-foreground/10 bg-bg-surface/80 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-accent-purple/30 hover:bg-bg-elevated [&>*]:flex [&>*]:items-center [&>*]:gap-2",
        className
      )}
    >
      <div>
        <span className={cn('relative inline-block rounded-full bg-accent-purple/10 p-2', iconClassName)}>
          {icon}
        </span>
        <p className={cn('text-lg font-bold', titleClassName)}>{title}</p>
      </div>
      <p className="whitespace-nowrap text-lg text-text-primary">{description}</p>
      {date && <p className="text-text-muted text-sm">{date}</p>}
    </div>
  )
}

interface DisplayCardsProps {
  cards?: DisplayCardProps[]
  /** Horizontal distance between each stacked card, in rem. */
  xStepRem?: number
  /** Vertical distance between each stacked card, in rem — also the hover lift/push distance. */
  yStepRem?: number
}

// Base per-index stack offset. Kept as CSS custom properties (not
// interpolated into Tailwind class names) because Tailwind can't generate
// CSS for a class string built at runtime — it only sees literal class
// text in source. `translate-x-[var(--tx)]` is a static, always-present
// class; only the *value* of --tx varies per card via inline style.
const DEFAULT_X_STEP_REM = 4
const DEFAULT_Y_STEP_REM = 2.5

const DEFAULT_CARDS: DisplayCardProps[] = [
  {
    icon: <Bot className="size-5 text-accent-purple" />,
    title: 'Autonomous Agents',
    description: 'Self-running AI systems',
    date: 'Latest Release',
  },
  {
    icon: <Zap className="size-5 text-accent-purple" />,
    title: 'Workflow Automation',
    description: 'Replacing manual tasks',
    date: 'Trending',
  },
  {
    icon: <Database className="size-5 text-accent-purple" />,
    title: 'RAG Knowledge Bases',
    description: 'Chat with your data',
    date: 'High Demand',
  },
]

export function DisplayCards({
  cards,
  xStepRem = DEFAULT_X_STEP_REM,
  yStepRem = DEFAULT_Y_STEP_REM,
}: DisplayCardsProps) {
  const displayCards = cards ?? DEFAULT_CARDS
  const total = displayCards.length

  return (
    <div className="grid [grid-template-areas:'stack'] place-items-center">
      {displayCards.map((cardProps, index) => {
        const isFront = index === total - 1
        const style = {
          '--tx': `${index * xStepRem}rem`,
          '--ty': `${index * yStepRem}rem`,
          // The hover lift/push distance is tied to the step size itself,
          // not a fixed value — otherwise a tighter fan-out (more cards)
          // would overshoot past the neighboring card's rest position.
          '--ty-step': `${yStepRem}rem`,
        } as CSSProperties

        return (
          <DisplayCard
            key={index}
            {...cardProps}
            style={style}
            className={cn(
              '[grid-area:stack] translate-x-[var(--tx)] translate-y-[var(--ty)]',
              isFront
                ? 'hover:translate-y-[calc(var(--ty)_+_var(--ty-step))]'
                : cn(
                    'grayscale hover:grayscale-0 hover:translate-y-[calc(var(--ty)_-_var(--ty-step))]',
                    "before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-xl before:bg-background/50 before:outline before:outline-1 before:outline-foreground/10 before:transition-opacity before:duration-700 before:content-[''] hover:before:opacity-0"
                  ),
              cardProps.className
            )}
          />
        )
      })}
    </div>
  )
}
