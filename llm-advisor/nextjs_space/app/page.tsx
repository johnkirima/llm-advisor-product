import { SiteHeader } from '@/components/landing/site-header'
import { Hero } from '@/components/landing/hero'
import { ProblemSection } from '@/components/landing/problem-section'
import { HowItWorks } from '@/components/landing/how-it-works'
import { PersonaSection } from '@/components/landing/persona-section'
import { FinalCta } from '@/components/landing/final-cta'
import { SiteFooter } from '@/components/landing/site-footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main id="main">
        <Hero />
        <ProblemSection />
        <HowItWorks />
        <PersonaSection />
        <FinalCta />
      </main>
      <SiteFooter />
    </div>
  )
}
