'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Check, Star } from 'lucide-react'
import type { RecommendationItem } from '@/lib/decision-types'

type Props = {
  selected: RecommendationItem
  onConfirm: (confidence: number) => void
  onBack: () => void
  submitting: boolean
}

const CONFIDENCE_LABELS: Record<number, string> = {
  1: 'Not confident',
  2: 'Slightly confident',
  3: 'Moderately confident',
  4: 'Confident',
  5: 'Very confident',
}

export function StepConfirm({ selected, onConfirm, onBack, submitting }: Props) {
  const [confidence, setConfidence] = useState<number>(0)
  const canSubmit = confidence >= 1 && confidence <= 5

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-muted/40 p-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your pick</p>
        <h3 className="mt-1 font-display text-2xl font-bold">{selected.llm.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{selected.llm.provider} — {selected.llm.tagline}</p>
        <p className="mt-3 text-sm">{selected.rationale.why}</p>
      </div>

      <div className="space-y-3">
        <Label className="text-base">How confident do you feel in this choice?</Label>
        <div
          className="flex items-center gap-2"
          role="radiogroup"
          aria-label="Confidence rating 1 to 5"
        >
          {[1, 2, 3, 4, 5].map((n) => {
            const active = n <= confidence
            return (
              <button
                type="button"
                key={n}
                role="radio"
                aria-checked={confidence === n}
                aria-label={`${n} out of 5: ${CONFIDENCE_LABELS[n]}`}
                onClick={() => setConfidence(n)}
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                  active
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                }`}
              >
                <Star
                  className={`h-5 w-5 ${active ? 'fill-primary' : ''}`}
                  aria-hidden="true"
                />
              </button>
            )
          })}
        </div>
        {confidence > 0 && (
          <p className="text-sm text-muted-foreground">{CONFIDENCE_LABELS[confidence]}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack} size="lg" className="rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back
        </Button>
        <Button
          type="button"
          onClick={() => canSubmit && onConfirm(confidence)}
          disabled={!canSubmit || submitting}
          size="lg"
          className="rounded-full"
        >
          {submitting ? 'Saving…' : 'Confirm decision'}
          <Check className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
