'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Lock, Sparkles, ShieldCheck, Scale, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { LucideIcon } from 'lucide-react'

const PILLARS: { icon: LucideIcon; label: string; desc: string }[] = [
  { icon: Sparkles, label: 'Quality', desc: 'Outputs you can trust.' },
  { icon: ShieldCheck, label: 'Reliability', desc: 'Consistent, on schedule.' },
  { icon: Wallet, label: 'Affordability', desc: 'A price that fits your budget.' },
]

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden hero-gradient"
    >
      {/* Decorative floating circles */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 -right-24 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-fuchsia-400/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 md:px-10 pt-36 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium text-primary">
            <Scale className="h-3.5 w-3.5" aria-hidden="true" /> Decision support for non-developers
          </span>

          <h1
            id="hero-heading"
            className="mt-6 font-display text-4xl font-bold tracking-tight md:text-6xl"
          >
            Choose the right AI model for your work —{' '}
            <span className="bg-gradient-to-r from-primary to-fuchsia-500 bg-clip-text text-transparent">
              in minutes, not hours.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            LLM Advisor helps you pick the best LLM for a specific task — balanced across quality, reliability, and affordability. No technical jargon. No endless benchmarks.
          </p>

          <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Button asChild size="lg" className="group rounded-full px-6 text-base">
              <Link href="/decision">
                Start decision workflow
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            </Button>
            <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <Lock className="h-4 w-4" aria-hidden="true" /> No signup required
            </p>
          </div>
        </motion.div>

        {/* Pillar cards */}
        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-3"
        >
          {PILLARS.map(({ icon: Icon, label, desc }) => (
            <li
              key={label}
              className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md"
              style={{ boxShadow: 'var(--shadow-sm)' }}
            >
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <h3 className="font-display text-base font-semibold">{label}</h3>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
