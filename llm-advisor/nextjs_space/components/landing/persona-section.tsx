'use client'

import { motion } from 'framer-motion'
import { Briefcase, Target, LineChart } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const TRAITS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Briefcase,
    title: 'Non-developer domain expert',
    body: 'You are an analyst, operations lead, or manager. You know your work — you do not need to know which transformer architecture is trending this week.',
  },
  {
    icon: Target,
    title: 'Deadline-driven',
    body: 'You have reports, decks, emails, and summaries due — today. You need a decision, not a research project.',
  },
  {
    icon: LineChart,
    title: 'Cost-conscious',
    body: 'Your budget is real. Cost surprises are not an option. You want clarity on price before you commit.',
  },
]

export function PersonaSection() {
  return (
    <section
      id="persona"
      aria-labelledby="persona-heading"
      className="border-t border-border bg-background py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr,1.2fr] lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4 }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Built for you
            </span>
            <h2
              id="persona-heading"
              className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl"
            >
              The Cost-Conscious Operations Analyst.
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Built for professionals who judge LLMs by what they produce — not by benchmark charts. If you spend more time choosing a model than using one, this is for you.
            </p>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="space-y-4"
          >
            {TRAITS.map(({ icon: Icon, title, body }) => (
              <li
                key={title}
                className="rounded-2xl border border-border bg-card p-6"
                style={{ boxShadow: 'var(--shadow-sm)' }}
              >
                <article>
                  <div className="flex items-start gap-4">
                    <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-semibold">{title}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  </div>
                </article>
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
