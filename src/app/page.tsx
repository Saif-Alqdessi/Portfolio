import { HeroSection }               from '@/components/sections/HeroSection'
import { TrackRecordSection }        from '@/components/sections/TrackRecordSection'
import { WhatIDoSection }            from '@/components/sections/WhatIDoSection'
import { TechStackSection }          from '@/components/sections/TechStackSection'
import { InquirySection }            from '@/components/sections/InquirySection'

export default function Home() {
  return (
    <main>
      <HeroSection />
      <TrackRecordSection />
      <WhatIDoSection />
      <TechStackSection />
      <InquirySection />
    </main>
  )
}
