import { HeroSection }               from '@/components/sections/HeroSection'
import { TrackRecordSection }        from '@/components/sections/TrackRecordSection'
import { AboutSection }              from '@/components/sections/AboutSection'
import { WhatIDoSection }            from '@/components/sections/WhatIDoSection'
import { ProjectsSection }           from '@/components/sections/ProjectsSection'
import { EngineeringApproachSection} from '@/components/sections/EngineeringApproachSection'
import { TechStackSection }          from '@/components/sections/TechStackSection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrackRecordSection />
      <AboutSection />
      <WhatIDoSection />
      <ProjectsSection />
      <EngineeringApproachSection />
      <TechStackSection />
    </main>
  )
}
