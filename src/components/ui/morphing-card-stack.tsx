'use client'

import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence, LayoutGroup, type PanInfo } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Grid3X3, Layers, LayoutList } from 'lucide-react'

export type LayoutMode = 'stack' | 'grid' | 'list'

export interface CardData {
  id: string
  title: string
  description: string
  icon?: ReactNode
  color?: string
  /** Concrete stack for this card, rendered as tags along the card's lower half. */
  tech?: string[]
}

export interface MorphingCardStackProps {
  cards?: CardData[]
  className?: string
  defaultLayout?: LayoutMode
  onCardClick?: (card: CardData) => void
}

const layoutIcons = {
  stack: Layers,
  grid: Grid3X3,
  list: LayoutList,
}

const SWIPE_THRESHOLD = 50

export function MorphingCardStack({
  cards = [],
  className,
  defaultLayout = 'stack',
  onCardClick,
}: MorphingCardStackProps) {
  const [layout, setLayout] = useState<LayoutMode>(defaultLayout)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)

  if (!cards || cards.length === 0) {
    return null
  }

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const { offset, velocity } = info
    const swipe = Math.abs(offset.x) * velocity.x

    if (offset.x < -SWIPE_THRESHOLD || swipe < -1000) {
      // Swiped left - go to next card
      setActiveIndex((prev) => (prev + 1) % cards.length)
    } else if (offset.x > SWIPE_THRESHOLD || swipe > 1000) {
      // Swiped right - go to previous card
      setActiveIndex((prev) => (prev - 1 + cards.length) % cards.length)
    }
    setIsDragging(false)
  }

  const getStackOrder = () => {
    const reordered = []
    for (let i = 0; i < cards.length; i++) {
      const index = (activeIndex + i) % cards.length
      reordered.push({ ...cards[index], stackPosition: i })
    }
    return reordered.reverse() // Reverse so top card renders last (on top)
  }

  const getLayoutStyles = (stackPosition: number) => {
    switch (layout) {
      case 'stack':
        return {
          top: stackPosition * 8,
          left: stackPosition * 8,
          zIndex: cards.length - stackPosition,
          rotate: (stackPosition - 1) * 2,
        }
      case 'grid':
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
        }
      case 'list':
        return {
          top: 0,
          left: 0,
          zIndex: 1,
          rotate: 0,
        }
    }
  }

  const containerStyles = {
    // w-full first so the deck can never exceed a 375px viewport; the fixed
    // 28rem is a desktop ceiling, not a floor.
    stack: 'relative h-80 w-full max-w-[28rem]',
    grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    list: 'flex flex-col gap-3',
  }

  const displayCards = layout === 'stack' ? getStackOrder() : cards.map((c, i) => ({ ...c, stackPosition: i }))

  return (
    <div className={cn('space-y-4', className)}>
      {/* Layout Toggle */}
      <div className="flex items-center justify-center gap-1 rounded-lg bg-bg-elevated/50 p-1 w-fit mx-auto">
        {(Object.keys(layoutIcons) as LayoutMode[]).map((mode) => {
          const Icon = layoutIcons[mode]
          return (
            <button
              key={mode}
              onClick={() => setLayout(mode)}
              className={cn(
                'flex h-11 w-11 items-center justify-center rounded-md transition-all sm:h-9 sm:w-9',
                layout === mode
                  ? 'bg-accent-purple text-bg-base'
                  : 'text-text-muted hover:text-text-primary hover:bg-bg-elevated',
              )}
              aria-label={`Switch to ${mode} layout`}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
      </div>

      {/* Cards Container */}
      <LayoutGroup>
        <motion.div layout className={cn(containerStyles[layout], 'mx-auto')}>
          <AnimatePresence mode="popLayout">
            {displayCards.map((card) => {
              const styles = getLayoutStyles(card.stackPosition)
              const isExpanded = expandedCard === card.id
              const isTopCard = layout === 'stack' && card.stackPosition === 0

              return (
                <motion.div
                  key={card.id}
                  layoutId={card.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: isExpanded ? 1.05 : 1,
                    x: 0,
                    ...styles,
                  }}
                  exit={{ opacity: 0, scale: 0.8, x: -200 }}
                  transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 25,
                  }}
                  drag={isTopCard ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.7}
                  onDragStart={() => setIsDragging(true)}
                  onDragEnd={handleDragEnd}
                  whileDrag={{ scale: 1.02, cursor: 'grabbing' }}
                  onClick={() => {
                    if (isDragging) return
                    setExpandedCard(isExpanded ? null : card.id)
                    onCardClick?.(card)
                  }}
                  className={cn(
                    'cursor-pointer rounded-xl border border-foreground/10 bg-bg-surface/90 backdrop-blur-md p-4',
                    'hover:border-accent-purple/50 transition-colors',
                    // calc leaves room for the 16px cascade offset applied to
                    // the cards behind the top one.
                    layout === 'stack' && 'absolute h-72 w-[calc(100%-1.5rem)]',
                    layout === 'stack' && isTopCard && 'cursor-grab active:cursor-grabbing',
                    layout === 'grid' && 'w-full',
                    layout === 'list' && 'w-full',
                    isExpanded && 'ring-2 ring-accent-purple',
                  )}
                  style={{
                    backgroundColor: card.color || undefined,
                  }}
                >
                  <div className="flex h-full flex-col">
                    <div className="flex items-start gap-3">
                      {card.icon && (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-purple">
                          {card.icon}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-text-primary line-clamp-2">{card.title}</h3>
                        <p
                          className={cn(
                            'text-sm text-text-muted mt-1',
                            layout === 'stack' && 'line-clamp-4',
                            layout === 'grid' && 'line-clamp-3',
                            layout === 'list' && 'line-clamp-1',
                          )}
                        >
                          {card.description}
                        </p>
                      </div>
                    </div>

                    {/* Stack tags fill the card's lower half. `mt-auto` pins them
                        to the bottom of whatever height the card ends up at, so
                        the tall stack cards read as full rather than top-heavy,
                        and grid cards line their tags up across a row. */}
                    {card.tech && card.tech.length > 0 && layout !== 'list' && (
                      <div className={cn('mt-auto border-t border-foreground/10 pt-3', isTopCard && 'mb-5')}>
                        <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-text-muted/70">
                          Stack
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {card.tech.map((t) => (
                            <span
                              key={t}
                              className="rounded-full border border-amber-500/20 bg-amber-500/10 px-2.5 py-0.5 text-[11px] font-medium text-amber-400 dark:text-amber-300"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {isTopCard && (
                    <div className="absolute bottom-2 left-0 right-0 text-center">
                      <span className="text-xs text-text-muted/50">Swipe to navigate</span>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {/* The visible dot stays small; the button around it carries the touch
          target, so the row reads the same but is tappable. */}
      {layout === 'stack' && cards.length > 1 && (
        <div className="flex justify-center !mt-12 sm:!mt-10">
          {cards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className="group flex h-11 w-10 items-center justify-center"
              aria-label={`Go to card ${index + 1}`}
              aria-current={index === activeIndex}
            >
              <span
                className={cn(
                  'h-1.5 rounded-full transition-all',
                  index === activeIndex
                    ? 'w-4 bg-accent-purple'
                    : 'w-1.5 bg-text-muted/30 group-hover:bg-text-muted/50',
                )}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
