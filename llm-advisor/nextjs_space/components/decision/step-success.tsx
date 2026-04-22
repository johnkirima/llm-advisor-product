'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, RefreshCcw, Home } from 'lucide-react'
import type { RecommendationItem } from '@/lib/decision-types'

type Props = {
  selected: RecommendationItem
  onStartOver: () => void
}

export function StepSuccess({ selected, onStartOver }: Props) {
  return (
    <div className="space-y-6 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-8 w-8" aria-hidden="true" />
      </div>
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">You’re all set</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
          Your decision is saved. Go use <strong>{selected.llm.name}</strong> for this task with confidence — you’ve thought it through.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-muted/40 p-6 text-left">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">What to do next</p>
        <ul className="mt-3 space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span>Open <strong>{selected.llm.name}</strong> (or your company’s wrapper) and paste in your task.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span>Include the audience and success criteria you described — it helps a lot.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" aria-hidden="true" />
            <span>If the result doesn’t feel right, come back and try the alternative.</span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button onClick={onStartOver} size="lg" variant="outline" className="rounded-full">
          <RefreshCcw className="mr-2 h-4 w-4" aria-hidden="true" /> Start another decision
        </Button>
        <Button asChild size="lg" className="rounded-full">
          <Link href="/">
            <Home className="mr-2 h-4 w-4" aria-hidden="true" /> Back to home
          </Link>
        </Button>
      </div>
    </div>
  )
}
