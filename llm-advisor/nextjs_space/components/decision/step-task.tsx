'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ArrowRight } from 'lucide-react'
import { TASK_TYPE_LABELS } from '@/lib/llms'
import type { TaskData, TaskType } from '@/lib/decision-types'

type Props = {
  initial?: Partial<TaskData>
  onSubmit: (data: TaskData) => void
  submitting: boolean
}

export function StepTask({ initial, onSubmit, submitting }: Props) {
  const [taskType, setTaskType] = useState<TaskType | ''>(initial?.task_type ?? '')
  const [audience, setAudience] = useState(initial?.audience ?? '')
  const [successCriteria, setSuccessCriteria] = useState(initial?.success_criteria ?? '')

  const canContinue = Boolean(taskType) && audience.trim().length > 0 && successCriteria.trim().length > 0

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        if (!canContinue) return
        onSubmit({
          task_type: taskType as TaskType,
          audience: audience.trim(),
          success_criteria: successCriteria.trim(),
        })
      }}
      className="space-y-6"
      noValidate
    >
      <div className="space-y-2">
        <Label htmlFor="task_type">What kind of work do you need help with?</Label>
        <Select value={taskType} onValueChange={(v) => setTaskType(v as TaskType)}>
          <SelectTrigger id="task_type" aria-required="true">
            <SelectValue placeholder="Pick the closest match…" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(TASK_TYPE_LABELS).map(([v, label]) => (
              <SelectItem key={v} value={v}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">Plain-English categories — pick the one that feels right.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="audience">Who is this for?</Label>
        <Input
          id="audience"
          value={audience}
          onChange={(e) => setAudience(e.target.value)}
          placeholder="e.g. my manager, an external client, my team"
          required
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="success">What does “good enough” look like?</Label>
        <Textarea
          id="success"
          value={successCriteria}
          onChange={(e) => setSuccessCriteria(e.target.value)}
          placeholder="e.g. clear one-paragraph summary with 3 action items; ready to send without editing."
          required
          rows={4}
          maxLength={1000}
        />
        <p className="text-xs text-muted-foreground">The clearer you are here, the better the recommendation.</p>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={!canContinue || submitting} size="lg" className="rounded-full">
          Continue
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    </form>
  )
}
