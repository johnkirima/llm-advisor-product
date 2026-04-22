'use client'

import { motion } from 'framer-motion'
import { FileText, SlidersHorizontal, ListChecks, CheckCircle2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const STEPS: { icon: LucideIcon; label: string; title: string; body: string }[] = [
  {
    icon: FileText,
    label: 'Step 1',
    title: 'Describe the task',
    body: 'Plain language: what is the outcome, who is the audience? No config files, no jargon.',
  },
  {
    icon: SlidersHorizontal,
    label: 'Step 2',
    title: 'Set priorities',
    body: 'Rank quality, reliability, and affordability. Tell us what matters under pressure.',
  },
  {
    icon: ListChecks,
    label: 'Step 3',
    title: 'Review recommendations',
    body: 'See a primary pick and a backup — each with a plain-language rationale.',
  },
  {
    icon: CheckCircle2,
    label: 'Step 4',
    title: 'Confirm with confidence',
    body: 'Choose your model, rate your confidence, and move on with your day.',
  },
]

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      aria-labelledby="how-heading"
      className="border-t border-border bg-muted/30 py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            How it works
          </span>
          <h2
            id="how-heading"
            className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl"
          >
            Four steps. One confident decision.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A guided workflow that captures context, applies consistent criteria, and returns a recommendation you can explain to anyone.
          </p>
        </div>

        <ol className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {STEPS.map(({ icon: Icon, label, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="relative rounded-2xl border border-border bg-card p-6"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <span className="sr-only">{label}: </span>
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <div className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                    {label}
                  </div>
                  <h3 className="mt-1 font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
