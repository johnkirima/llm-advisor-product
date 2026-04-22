import { LLM_CATALOG } from './llms';
import {
  ConstraintsData,
  LLMInfo,
  PrioritiesData,
  Priority,
  RecommendationItem,
  RecommendationRationale,
  TaskData,
} from './decision-types';

const WEIGHTS: Record<1 | 2 | 3, number> = { 1: 0.5, 2: 0.3, 3: 0.2 };

const PRIORITY_LABELS: Record<Priority, string> = {
  quality: 'Quality of output',
  reliability: 'Reliability and consistency',
  affordability: 'Affordability',
};

function priorityScore(llm: LLMInfo, p: Priority): number {
  return llm.scores[p];
}

// Core scoring: weighted sum of the user's three priorities, then constraint
// adjustments, then a task-type match bonus.
function baseWeightedScore(llm: LLMInfo, priorities: PrioritiesData): number {
  return (
    priorityScore(llm, priorities.rank_1) * WEIGHTS[1] +
    priorityScore(llm, priorities.rank_2) * WEIGHTS[2] +
    priorityScore(llm, priorities.rank_3) * WEIGHTS[3]
  );
}

function constraintAdjustment(
  llm: LLMInfo,
  constraints: ConstraintsData
): { delta: number; notes: string[] } {
  let delta = 0;
  const notes: string[] = [];

  if (constraints.deadline_urgency === 'urgent') {
    if (llm.speedTier === 'fast') {
      delta += 1.0;
      notes.push('fast responses fit your tight deadline');
    } else if (llm.speedTier === 'thorough') {
      delta -= 1.0;
      notes.push('slower pace is a drawback given your deadline');
    }
  }

  if (constraints.budget_sensitivity === 'major_concern') {
    if (llm.costTier === 'budget') {
      delta += 1.5;
      notes.push('budget-friendly pricing aligns with your cost concerns');
    } else if (llm.costTier === 'premium') {
      delta -= 1.5;
      notes.push('premium pricing conflicts with your cost concerns');
    }
  } else if (constraints.budget_sensitivity === 'prefer_affordable') {
    if (llm.costTier === 'budget') {
      delta += 0.5;
      notes.push('affordable option matching your preference');
    } else if (llm.costTier === 'premium') {
      delta -= 0.5;
      notes.push('higher price than your preference');
    }
  }

  return { delta, notes };
}

function taskTypeBonus(
  llm: LLMInfo,
  task: TaskData
): { delta: number; note: string | null } {
  if (llm.strengthsFor.includes(task.task_type)) {
    return {
      delta: 0.5,
      note: 'recognized strength for this kind of task',
    };
  }
  return { delta: 0, note: null };
}

function buildRationale(
  llm: LLMInfo,
  priorities: PrioritiesData,
  constraints: ConstraintsData,
  task: TaskData,
  constraintNotes: string[],
  taskNote: string | null
): RecommendationRationale {
  // Strengths: top two highest scoring priorities for this LLM
  const priorityList: Priority[] = ['quality', 'reliability', 'affordability'];
  const sortedByScore = [...priorityList].sort(
    (a, b) => llm.scores[b] - llm.scores[a]
  );
  const top2 = sortedByScore.slice(0, 2);
  const weakest = sortedByScore[2];

  const strengths: string[] = top2.map(
    (p) => `${PRIORITY_LABELS[p]} (${llm.scores[p].toFixed(1)}/10)`
  );
  if (taskNote) strengths.push(taskNote);

  const tradeoffs: string[] = [
    `${PRIORITY_LABELS[weakest]} is its weaker area (${llm.scores[weakest].toFixed(1)}/10)`,
    ...constraintNotes.filter((n) => n.includes('conflict') || n.includes('drawback') || n.includes('higher price')),
  ];

  const topPriorityLabel = PRIORITY_LABELS[priorities.rank_1].toLowerCase();
  const why = `You told us ${topPriorityLabel} matters most. ${llm.name} is a strong match because it scores ${llm.scores[priorities.rank_1].toFixed(1)}/10 there, and its overall profile fits what you described. ${llm.plainLanguageSummary}`;

  const estimatedCostNote = `About $${llm.approxCostPer1kTokens.toFixed(4)} per 1,000 tokens — roughly ${llm.costTier === 'budget' ? 'a fraction of a cent per short email' : llm.costTier === 'standard' ? 'pennies per short email' : 'a few pennies per short email'}.`;

  return { why, strengths, tradeoffs, estimatedCostNote };
}

export function scoreLLMs(
  task: TaskData,
  constraints: ConstraintsData,
  priorities: PrioritiesData
): RecommendationItem[] {
  const scored = LLM_CATALOG.map((llm) => {
    const base = baseWeightedScore(llm, priorities);
    const c = constraintAdjustment(llm, constraints);
    const t = taskTypeBonus(llm, task);
    const total = base + c.delta + t.delta;
    return {
      llm,
      score: total,
      constraintNotes: c.notes,
      taskNote: t.note,
    };
  });

  scored.sort((a, b) => b.score - a.score);
  const top2 = scored.slice(0, 2);

  return top2.map((entry, idx) => ({
    llm_id: entry.llm.id,
    llm: entry.llm,
    rank: idx + 1,
    weighted_score: Number(entry.score.toFixed(2)),
    rationale: buildRationale(
      entry.llm,
      priorities,
      constraints,
      task,
      entry.constraintNotes,
      entry.taskNote
    ),
  }));
}
