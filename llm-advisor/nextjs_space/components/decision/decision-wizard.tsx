'use client'

import { useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { ProgressBar } from './progress-bar'
import { StepTask } from './step-task'
import { StepConstraints } from './step-constraints'
import { StepPriorities } from './step-priorities'
import { StepRecommendations } from './step-recommendations'
import { StepConfirm } from './step-confirm'
import { StepSuccess } from './step-success'
import type {
  ConstraintsData,
  PrioritiesData,
  RecommendationItem,
  TaskData,
} from '@/lib/decision-types'

type Screen =
  | 'task'
  | 'constraints'
  | 'priorities'
  | 'recommendations'
  | 'confirm'
  | 'success'

const STEP_LABELS = ['Task', 'Constraints', 'Priorities', 'Recommendation', 'Confirm']
const SCREEN_TO_STEP: Record<Screen, number> = {
  task: 1,
  constraints: 2,
  priorities: 3,
  recommendations: 4,
  confirm: 5,
  success: 5,
}

export function DecisionWizard() {
  const [screen, setScreen] = useState<Screen>('task')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [taskData, setTaskData] = useState<TaskData | null>(null)
  const [constraintsData, setConstraintsData] = useState<ConstraintsData | null>(null)
  const [prioritiesData, setPrioritiesData] = useState<PrioritiesData | null>(null)
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [selectedLlmId, setSelectedLlmId] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedRec = useMemo(
    () => recommendations.find((r) => r.llm_id === selectedLlmId) ?? null,
    [recommendations, selectedLlmId]
  )

  const ensureSession = useCallback(async (): Promise<string> => {
    if (sessionId) return sessionId
    const res = await fetch('/api/sessions', { method: 'POST' })
    if (!res.ok) throw new Error('Could not start session')
    const json = await res.json()
    setSessionId(json.sessionId)
    return json.sessionId as string
  }, [sessionId])

  async function handleTaskSubmit(data: TaskData) {
    setSubmitting(true)
    setError(null)
    try {
      const id = await ensureSession()
      const res = await fetch(`/api/sessions/${id}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Could not save task')
      }
      setTaskData(data)
      setScreen('constraints')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleConstraintsSubmit(data: ConstraintsData) {
    if (!sessionId) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/sessions/${sessionId}/constraints`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Could not save constraints')
      }
      setConstraintsData(data)
      setScreen('priorities')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  async function handlePrioritiesSubmit(data: PrioritiesData) {
    if (!sessionId) return
    setSubmitting(true)
    setError(null)
    try {
      const resP = await fetch(`/api/sessions/${sessionId}/priorities`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!resP.ok) {
        const j = await resP.json().catch(() => ({}))
        throw new Error(j.error || 'Could not save priorities')
      }
      setPrioritiesData(data)

      const resR = await fetch(`/api/sessions/${sessionId}/recommendations`, {
        method: 'POST',
      })
      if (!resR.ok) {
        const j = await resR.json().catch(() => ({}))
        throw new Error(j.error || 'Could not compute recommendations')
      }
      const { recommendations: recs } = (await resR.json()) as {
        recommendations: RecommendationItem[]
      }
      setRecommendations(recs)
      setSelectedLlmId(recs[0]?.llm_id ?? null)
      setScreen('recommendations')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleConfirm(confidence: number) {
    if (!sessionId || !selectedLlmId) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(`/api/sessions/${sessionId}/selection`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ llm_id: selectedLlmId, confidence }),
      })
      if (!res.ok) {
        const j = await res.json().catch(() => ({}))
        throw new Error(j.error || 'Could not save your selection')
      }
      setScreen('success')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  function handleStartOver() {
    setScreen('task')
    setSessionId(null)
    setTaskData(null)
    setConstraintsData(null)
    setPrioritiesData(null)
    setRecommendations([])
    setSelectedLlmId(null)
    setError(null)
  }

  const currentStep = SCREEN_TO_STEP[screen]

  return (
    <div className="mx-auto max-w-3xl px-6 pb-24 pt-28 md:px-10">
      <div className="mb-10">
        <ProgressBar current={currentStep} steps={STEP_LABELS} />
      </div>

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-3 rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {screen === 'task' && (
            <div>
              <div className="mb-6">
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  Tell us about the task
                </h1>
                <p className="mt-2 text-muted-foreground">
                  A few quick questions so we can match you with a good-fit LLM.
                </p>
              </div>
              <StepTask
                initial={taskData ?? undefined}
                onSubmit={handleTaskSubmit}
                submitting={submitting}
              />
            </div>
          )}

          {screen === 'constraints' && (
            <div>
              <div className="mb-6">
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  What are your real-world constraints?
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Deadlines and budget change which model makes sense. Be honest — nothing is wrong.
                </p>
              </div>
              <StepConstraints
                initial={constraintsData ?? undefined}
                onSubmit={handleConstraintsSubmit}
                onBack={() => setScreen('task')}
                submitting={submitting}
              />
            </div>
          )}

          {screen === 'priorities' && (
            <div>
              <div className="mb-6">
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  What matters most to you?
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Quality, reliability, affordability. Rank them for this task — we’ll do the math.
                </p>
              </div>
              <StepPriorities
                initial={prioritiesData ?? undefined}
                onSubmit={handlePrioritiesSubmit}
                onBack={() => setScreen('constraints')}
                submitting={submitting}
              />
            </div>
          )}

          {screen === 'recommendations' && (
            <div>
              <div className="mb-6">
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  Your recommended match
                </h1>
                <p className="mt-2 text-muted-foreground">
                  Plain-language reasoning — no benchmark jargon.
                </p>
              </div>
              <StepRecommendations
                recommendations={recommendations}
                selectedLlmId={selectedLlmId}
                onSelect={(id) => setSelectedLlmId(id)}
                onContinue={() => setScreen('confirm')}
                onBack={() => setScreen('priorities')}
              />
            </div>
          )}

          {screen === 'confirm' && selectedRec && (
            <div>
              <div className="mb-6">
                <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                  Ready to commit?
                </h1>
                <p className="mt-2 text-muted-foreground">
                  One last check — how sure do you feel? We’ll log it with your decision.
                </p>
              </div>
              <StepConfirm
                selected={selectedRec}
                onConfirm={handleConfirm}
                onBack={() => setScreen('recommendations')}
                submitting={submitting}
              />
            </div>
          )}

          {screen === 'success' && selectedRec && (
            <StepSuccess
              selected={selectedRec}
              onStartOver={handleStartOver}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
