import { DecisionWizard } from '@/components/decision/decision-wizard'
import { SiteFooter } from '@/components/landing/site-footer'
import { SiteHeader } from '@/components/landing/site-header'

export const metadata = {
  title: 'Start your LLM decision — LLM Advisor',
  description:
    'Answer a few plain-language questions and get a matched LLM recommendation for your work task.',
}

export default function DecisionPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <SiteHeader />
      <main id="main" className="flex-1">
        <DecisionWizard />
      </main>
      <SiteFooter />
    </div>
  )
}
