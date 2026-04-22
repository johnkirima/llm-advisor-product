'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { ConstraintsData, Urgency, Budget } from '@/lib/decision-types'

type Props = {
  initial?: Partial<ConstraintsData>
  onSubmit: (data: ConstraintsData) => void
  onBack: () => void
  submitting: boolean
}

const URGENCY_OPTIONS: { value: Urgency; label: string; hint: string }[] = [
  { value: 'no_rush', label: 'No rush', hint: 'I have time to iterate.' },
  { value: 'moderate', label: 'Sometime this week', hint: 'Steady pace is fine.' },
  { value: 'urgent', label: 'Need it soon', hint: 'Due today or tomorrow.' },
]

const BUDGET_OPTIONS: { value: Budget; label: string; hint: string }[] = [
  { value: 'not_concerned', label: 'Not really', hint: 'Quality matters more than cost here.' },
  { value: 'prefer_affordable', label: 'Somewhat', hint: 'I’d prefer the more affordable option if it’s close.' },
  { value: 'major_concern', label: 'Yes, very', hint: 'Cost is a real constraint — keep it cheap.' },
]

export function StepConstraints({ initial, onSubmit, onBack, submitting }: Props) {
  const [urgency, setUrgency] = useState<Urgency | ''>(initial?.deadline_urgency ?? '')
  const [budget, setBudget] = useState<Budget | ''>(initial?.budget_sensitivity ?? '')

  const canContinue = Boolean(urgency) && Boolean(budget)

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!canContinue) return
        onSubmit({
          deadline_urgency: urgency as Urgency,
          budget_sensitivity: budget as Budget,
        })
      }}
      className="space-y-8"
      noValidate
    >
      <fieldset className="space-y-3">
        <legend>
          <Label className="text-base">How soon do you need this?</Label>
        </legend>
        <RadioGroup
          value={urgency}
          onValueChange={(v) => setUrgency(v as Urgency)}
          className="grid gap-3 sm:grid-cols-3"
        >
          {URGENCY_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              htmlFor={`urgency-${opt.value}`}
              className={`flex cursor-pointer flex-col gap-1 rounded-2xl border-2 p-4 transition-colors ${
                urgency === opt.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={opt.value} id={`urgency-${opt.value}`} />
                <span className="font-medium">{opt.label}</span>
              </div>
              <span className="pl-7 text-xs text-muted-foreground">{opt.hint}</span>
            </label>
          ))}
        </RadioGroup>
      </fieldset>

      <fieldset className="space-y-3">
        <legend>
          <Label className="text-base">How cost-sensitive is this task?</Label>
        </legend>
        <RadioGroup
          value={budget}
          onValueChange={(v) => setBudget(v as Budget)}
          className="grid gap-3 sm:grid-cols-3"
        >
          {BUDGET_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              htmlFor={`budget-${opt.value}`}
              className={`flex cursor-pointer flex-col gap-1 rounded-2xl border-2 p-4 transition-colors ${
                budget === opt.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/40'
              }`}
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem value={opt.value} id={`budget-${opt.value}`} />
                <span className="font-medium">{opt.label}</span>
              </div>
              <span className="pl-7 text-xs text-muted-foreground">{opt.hint}</span>
            </label>
          ))}
        </RadioGroup>
      </fieldset>

      <div className="flex items-center justify-between">
        <Button type="button" variant="ghost" onClick={onBack} size="lg" className="rounded-full">
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" /> Back
        </Button>
        <Button type="submit" disabled={!canContinue || submitting} size="lg" className="rounded-full">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}
