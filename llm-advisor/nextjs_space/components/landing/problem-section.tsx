'use client'

import { motion } from 'framer-motion'
import { Layers, Scale, RotateCcw, Timer } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const PROBLEMS: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Layers,
    title: 'Too many models',
    body: 'New LLMs and versions launch every week. Keeping up is a second job you did not sign up for.',
  },
  {
    icon: Scale,
    title: 'Unclear tradeoffs',
    body: 'Quality vs. reliability vs. cost. The wrong pick wastes hours, money, or credibility on work that is already due.',
  },
  {
    icon: RotateCcw,
    title: 'Fear of redoing work',
    body: 'Pick the wrong model and you start over. You need confidence before you commit, not regret after.',
  },
  {
    icon: Timer,
    title: 'Deadline pressure',
    body: 'You need a decision, not a literature review. Blog posts and benchmark threads are not an option at 4pm.',
  },
]

export function ProblemSection() {
  return (
    <section
      id="problem"
      aria-labelledby="problem-heading"
      className="border-t border-border bg-background py-24"
    >
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <div className="max-w-3xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">
            The problem
          </span>
          <h2
            id="problem-heading"
            className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl"
          >
            Choosing an LLM should not feel impossible.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            You are an analyst, a manager, a domain expert — not a developer. You just want the right model for the job, and the landscape will not stand still long enough for you to learn it.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-2">
          {PROBLEMS.map(({ icon: Icon, title, body }, i) => (
            <motion.li
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-0.5"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-display text-lg font-semibold">{title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  )
}
