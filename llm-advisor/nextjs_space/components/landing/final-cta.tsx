'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function FinalCta() {
  return (
    <section
      id="cta"
      aria-labelledby="cta-heading"
      className="relative overflow-hidden border-t border-border"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary to-primary/80" aria-hidden="true" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.4 }}
        className="relative mx-auto max-w-4xl px-6 md:px-10 py-20 text-center"
      >
        <h2
          id="cta-heading"
          className="font-display text-3xl font-bold tracking-tight text-primary-foreground md:text-5xl"
        >
          Stop guessing. <span className="text-white/80">Start deciding.</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-primary-foreground/90">
          Get a confident LLM recommendation in under two minutes. No signup required.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="group rounded-full px-6 text-base"
          >
            <Link href="/decision">
              Start decision workflow
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </Button>
          <p className="inline-flex items-center gap-2 text-sm text-primary-foreground/90">
            <Lock className="h-4 w-4" aria-hidden="true" /> No signup required
          </p>
        </div>
      </motion.div>
    </section>
  )
}
