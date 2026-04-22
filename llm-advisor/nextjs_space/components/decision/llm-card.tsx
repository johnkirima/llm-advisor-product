'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import type { RecommendationItem } from '@/lib/decision-types'
import { Check, Sparkles, ShieldCheck, DollarSign } from 'lucide-react'

type Props = {
  rec: RecommendationItem
  isSelected: boolean
  onSelect: () => void
  badgeLabel: string
}

const TIER_LABELS: Record<string, string> = {
  budget: 'Budget-friendly',
  standard: 'Mid-range',
  premium: 'Premium',
  fast: 'Fast',
  thorough: 'Thorough',
}

export function LLMCard({ rec, isSelected, onSelect, badgeLabel }: Props) {
  const { llm, rationale, weighted_score } = rec
  return (
    <Card
      className={`relative cursor-pointer rounded-2xl border-2 transition-all ${
        isSelected
          ? 'border-primary shadow-lg'
          : 'border-border hover:border-primary/40 hover:shadow-md'
      }`}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect()
        }
      }}
    >
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <Badge variant="secondary" className="mb-2">
              {badgeLabel}
            </Badge>
            <h3 className="font-display text-2xl font-bold tracking-tight">
              {llm.name}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {llm.provider} • {llm.tagline}
            </p>
          </div>
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
              isSelected
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background'
            }`}
            aria-hidden="true"
          >
            {isSelected && <Check className="h-4 w-4" />}
          </div>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium">
            <Sparkles className="h-3 w-3" aria-hidden="true" /> Quality {llm.scores.quality.toFixed(1)}/10
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium">
            <ShieldCheck className="h-3 w-3" aria-hidden="true" /> Reliability {llm.scores.reliability.toFixed(1)}/10
          </span>
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium">
            <DollarSign className="h-3 w-3" aria-hidden="true" /> Affordability {llm.scores.affordability.toFixed(1)}/10
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 font-medium">
            {TIER_LABELS[llm.costTier]} · {TIER_LABELS[llm.speedTier]}
          </span>
        </div>

        <p className="mb-4 text-sm leading-relaxed">
          {rationale.why}
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Why it fits
            </p>
            <ul className="space-y-1">
              {rationale.strengths.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Trade-offs to know
            </p>
            <ul className="space-y-1">
              {rationale.tradeoffs.length > 0 ? (
                rationale.tradeoffs.map((t, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" aria-hidden="true" />
                    <span>{t}</span>
                  </li>
                ))
              ) : (
                <li className="text-sm text-muted-foreground">No significant trade-offs</li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs text-muted-foreground">
          <span>{rationale.estimatedCostNote}</span>
          <span className="font-mono">Match score: {weighted_score.toFixed(2)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
