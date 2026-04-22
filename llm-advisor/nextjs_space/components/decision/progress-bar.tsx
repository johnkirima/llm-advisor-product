'use client'

import { Check } from 'lucide-react'

type Props = {
  current: number // 1-based current step
  steps: string[]
}

export function ProgressBar({ current, steps }: Props) {
  return (
    <div className="w-full" aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((label, idx) => {
          const stepNumber = idx + 1
          const isDone = stepNumber < current
          const isActive = stepNumber === current
          return (
            <li
              key={label}
              className={`flex items-center ${idx !== steps.length - 1 ? 'flex-1' : ''}`}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors ${
                    isDone
                      ? 'bg-primary text-primary-foreground'
                      : isActive
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isDone ? <Check className="h-4 w-4" aria-hidden="true" /> : stepNumber}
                </div>
                <span
                  className={`mt-2 hidden text-xs md:block ${
                    isActive ? 'font-medium text-foreground' : 'text-muted-foreground'
                  }`}
                >
                  {label}
                </span>
              </div>
              {idx !== steps.length - 1 && (
                <div
                  className={`mx-2 h-0.5 flex-1 rounded-full md:mx-4 ${
                    isDone ? 'bg-primary' : 'bg-muted'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </div>
  )
}
