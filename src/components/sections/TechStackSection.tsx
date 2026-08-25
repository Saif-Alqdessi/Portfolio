import type { IconType } from 'react-icons'
import {
  SiNextdotjs, SiReact, SiTypescript, SiTailwindcss, SiPython, SiPytorch,
  SiTensorflow, SiLangchain, SiLanggraph, SiHuggingface, SiAnthropic, SiFastapi,
  SiNodedotjs, SiPostgresql, SiSupabase, SiRedis, SiDocker, SiGit, SiLinux,
  SiVercel, SiN8N, SiZapier, SiExpress, SiJupyter,
} from 'react-icons/si'
import { TbBrandOpenai, TbBrandAws } from 'react-icons/tb'
import { ScrollReveal } from '@/components/ui/ScrollReveal'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { cn } from '@/lib/utils'

interface TechItem {
  name: string
  Icon: IconType
}

// Curated to match the real, verified skill set (see the "skills" content
// used elsewhere on the site) — not every logo-able brand exists in either
// icon pack, and a couple of items from the original brief (Google Gemini,
// Google Cloud, Azure, MongoDB, GraphQL, Prisma) aren't part of the real
// skill list, so they're swapped for verified ones instead of shown as-is.
const ROW_1: TechItem[] = [
  { name: 'Next.js', Icon: SiNextdotjs },
  { name: 'React', Icon: SiReact },
  { name: 'TypeScript', Icon: SiTypescript },
  { name: 'Tailwind CSS', Icon: SiTailwindcss },
  { name: 'Python', Icon: SiPython },
  { name: 'PyTorch', Icon: SiPytorch },
  { name: 'TensorFlow', Icon: SiTensorflow },
  { name: 'LangChain', Icon: SiLangchain },
  { name: 'LangGraph', Icon: SiLanggraph },
  { name: 'Hugging Face', Icon: SiHuggingface },
  { name: 'OpenAI', Icon: TbBrandOpenai },
  { name: 'Anthropic Claude', Icon: SiAnthropic },
  { name: 'FastAPI', Icon: SiFastapi },
]

const ROW_2: TechItem[] = [
  { name: 'Node.js', Icon: SiNodedotjs },
  { name: 'PostgreSQL', Icon: SiPostgresql },
  { name: 'Supabase', Icon: SiSupabase },
  { name: 'Redis', Icon: SiRedis },
  { name: 'Docker', Icon: SiDocker },
  { name: 'Git', Icon: SiGit },
  { name: 'Linux', Icon: SiLinux },
  { name: 'AWS', Icon: TbBrandAws },
  { name: 'Vercel', Icon: SiVercel },
  { name: 'n8n', Icon: SiN8N },
  { name: 'Zapier', Icon: SiZapier },
  { name: 'Express', Icon: SiExpress },
  { name: 'Jupyter', Icon: SiJupyter },
]

function TechItemCard({ item, ariaHidden }: { item: TechItem; ariaHidden?: boolean }) {
  const { Icon, name } = item
  return (
    <div
      className="group flex w-20 flex-shrink-0 flex-col items-center gap-3 border-none bg-transparent p-0"
      aria-hidden={ariaHidden || undefined}
    >
      <Icon
        size={32}
        className="text-zinc-600 transition-all duration-200 group-hover:scale-110 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-white"
      />
      <span className="text-center text-[10px] font-mono tracking-widest text-zinc-500 transition-colors duration-200 group-hover:text-zinc-900 dark:text-zinc-400 dark:group-hover:text-zinc-200">
        {name}
      </span>
    </div>
  )
}

function MarqueeRow({ items, direction }: { items: TechItem[]; direction: 'left' | 'right' }) {
  return (
    <div className="overflow-hidden">
      <div
        className={cn(
          'flex w-max items-center gap-10 hover:[animation-play-state:paused] motion-reduce:[animation-play-state:paused]',
          direction === 'left' ? 'animate-marquee-left' : 'animate-marquee-right'
        )}
      >
        {items.map((item) => (
          <TechItemCard key={item.name} item={item} />
        ))}
        {items.map((item) => (
          <TechItemCard key={`${item.name}-dup`} item={item} ariaHidden />
        ))}
      </div>
    </div>
  )
}

export function TechStackSection() {
  return (
    <section id="stack" className="overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <ScrollReveal direction="up">
          <SectionHeader
            label="Technologies"
            title="Tech Stack"
            subtitle="Tools and technologies I use to build intelligent systems"
            align="center"
          />
        </ScrollReveal>
      </div>

      <ScrollReveal direction="up" delay={100} className="relative mt-16">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent sm:w-32" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent sm:w-32" />

        <div className="space-y-8">
          <MarqueeRow items={ROW_1} direction="left" />
          <MarqueeRow items={ROW_2} direction="right" />
        </div>
      </ScrollReveal>
    </section>
  )
}
