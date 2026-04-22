'use client'

import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { LLMCard } from './llm-card'
import type { RecommendationItem } from '@/lib/decision-types'

type Props = {
  recommendations: RecommendationItem[]
  selectedLlmId: string | null
  onSelect: (llmId: string) => void
  onContinue: () => void
  onBack: () => void
}

export function StepRecommendations({
  recommendations,
  selectedLlmId,
  onSelect,
  onContinue,
  onBack,
}: Props) {
  const primary = recommendations[0]
  const alternative = recommendations[1]

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Based on your answers, here are the top two matches. Your primary pick is highlighted — the alternative is there in case trade-offs change your mind.
      </p>

      <div className="grid gap-4 lg:grid-cols-2">
        {primary && (
          <LLMCard
            rec={primary}
            badgeLabel="Recommended"
            isSelected={selectedLlmId === primary.llm_id}
            onSelect={() => onSelect(primary.llm_id)}
          />
        )}
        {alternative && (
          <LLMCard
            rec={alternative}
            badgeLabel="Alternative"
            isSelected={selectedLlmId === alternative.llm_id}
            onSelect={() => onSelect(alternative.llm_id)}
          />
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack} size="lg" className="rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          disabled={!selectedLlmId}
          size="lg"
          className="rounded-full"
        >
          Continue with this pick
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </div>
  )
}
