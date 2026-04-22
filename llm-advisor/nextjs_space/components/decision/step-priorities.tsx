'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowLeft, ArrowRight, Sparkles, ShieldCheck, DollarSign } from 'lucide-react'
import type { PrioritiesData, Priority } from '@/lib/decision-types'

type Props = {
  initial?: Partial<PrioritiesData>
  onSubmit: (data: PrioritiesData) => void
  onBack: () => void
  submitting: boolean
}

const PRIORITY_META: Record<Priority, { label: string; hint: string; Icon: typeof Sparkles }> = {
  quality: {
    label: 'Quality of output',
    hint: 'Polished, nuanced, and well-reasoned results.',
    Icon: Sparkles,
  },
  reliability: {
    label: 'Reliability and consistency',
    hint: 'Steady, predictable answers every time.',
    Icon: ShieldCheck,
  },
  affordability: {
    label: 'Affordability',
    hint: 'Lower cost per use.',
    Icon: DollarSign,
  },
}

const ALL_PRIORITIES: Priority[] = ['quality', 'reliability', 'affordability']

export function StepPriorities({ initial, onSubmit, onBack, submitting }: Props) {
  const [rank1, setRank1] = useState<Priority | ''>(initial?.rank_1 ?? '')
  const [rank2, setRank2] = useState<Priority | ''>(initial?.rank_2 ?? '')
  const [rank3, setRank3] = useState<Priority | ''>(initial?.rank_3 ?? '')

  // When rank 1 is picked, auto-trim rank 2 / 3 if they clash.
  function setTop(v: Priority) {
    setRank1(v)
    if (rank2 === v) setRank2('')
    if (rank3 === v) setRank3('')
  }
  function setMid(v: Priority) {
    setRank2(v)
    if (rank3 === v) setRank3('')
    if (rank1 === v) setRank1('')
  }
  function setLast(v: Priority) {
    setRank3(v)
    if (rank1 === v) setRank1('')
    if (rank2 === v) setRank2('')
  }

  const availableForRank2 = useMemo(
    () => ALL_PRIORITIES.filter((p) => p !== rank1),
    [rank1]
  )
  const availableForRank3 = useMemo(
    () => ALL_PRIORITIES.filter((p) => p !== rank1 && p !== rank2),
    [rank1, rank2]
  )

  // Auto-fill rank 3 when only one option remains.
  if (rank1 && rank2 && !rank3 && availableForRank3.length === 1) {
    setTimeout(() => setRank3(availableForRank3[0]), 0)
  }

  const canContinue = Boolean(rank1) && Boolean(rank2) && Boolean(rank3)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!canContinue) return
        onSubmit({
          rank_1: rank1 as Priority,
          rank_2: rank2 as Priority,
          rank_3: rank3 as Priority,
        })
      }}
      className="space-y-6"
      noValidate
    >
      <p className="text-sm text-muted-foreground">
        Rank these three from most to least important for <em>this specific task</em>. Your top pick gets the biggest say in the recommendation.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rank1">Most important</Label>
          <Select value={rank1} onValueChange={(v) => setTop(v as Priority)}>
            <SelectTrigger id="rank1">
              <SelectValue placeholder="Pick your top priority…" />
            </SelectTrigger>
            <SelectContent>
              {ALL_PRIORITIES.map((p) => {
                const { label, hint, Icon } = PRIORITY_META[p]
                return (
                  <SelectItem key={p} value={p}>
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{label}</span>
                      <span className="text-xs text-muted-foreground">— {hint}</span>
                    </span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rank2">Second most important</Label>
          <Select value={rank2} onValueChange={(v) => setMid(v as Priority)} disabled={!rank1}>
            <SelectTrigger id="rank2">
              <SelectValue placeholder={rank1 ? 'Pick the next priority…' : 'Choose your top pick first'} />
            </SelectTrigger>
            <SelectContent>
              {availableForRank2.map((p) => {
                const { label, hint, Icon } = PRIORITY_META[p]
                return (
                  <SelectItem key={p} value={p}>
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{label}</span>
                      <span className="text-xs text-muted-foreground">— {hint}</span>
                    </span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="rank3">Least important</Label>
          <Select value={rank3} onValueChange={(v) => setLast(v as Priority)} disabled={!rank1 || !rank2}>
            <SelectTrigger id="rank3">
              <SelectValue placeholder={rank1 && rank2 ? 'Last one…' : 'Finish the top two first'} />
            </SelectTrigger>
            <SelectContent>
              {availableForRank3.map((p) => {
                const { label, hint, Icon } = PRIORITY_META[p]
                return (
                  <SelectItem key={p} value={p}>
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{label}</span>
                      <span className="text-xs text-muted-foreground">— {hint}</span>
                    </span>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack} size="lg" className="rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back
        </Button>
        <Button type="submit" disabled={!canContinue || submitting} size="lg" className="rounded-full">
          {submitting ? 'Thinking…' : 'See recommendation'}
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}
