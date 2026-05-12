import { MyceliumHero } from './_landing/MyceliumHero'
import { JourneySection } from './_landing/JourneySection'
import { TestimonialsSection } from './_landing/TestimonialsSection'
import { HowItWorksSection } from './_landing/HowItWorksSection'
import { LandingFooter } from './_landing/LandingFooter'
import { CustomCursor } from './_landing/CustomCursor'

export default function HomePage() {
  return (
    <div style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* Custom trailing cursor — only activates on pointer:fine devices */}
      <CustomCursor />

      {/* 1 — Animated mycelium hero */}
      <div data-cursor="grow">
        <MyceliumHero />
      </div>

      {/* 2 — The three-stage journey (Arriving / Settling / Belonging) */}
      <JourneySection />

      {/* 3 — Editorial testimonials */}
      <TestimonialsSection />

      {/* 4 — How it works: Buddy + Map + Guides */}
      <HowItWorksSection />

      {/* 5 — Warm emotional footer */}
      <LandingFooter />
    </div>
  )
}
