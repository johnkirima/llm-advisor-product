// Shared TypeScript types for the decision workflow

export type TaskType =
  | 'draft_communication'
  | 'summarize_document'
  | 'data_analysis'
  | 'research_synthesis'
  | 'brainstorm_ideas'
  | 'translate_rewrite'
  | 'technical_question'
  | 'other';

export type Urgency = 'no_rush' | 'moderate' | 'urgent';
export type Budget = 'not_concerned' | 'prefer_affordable' | 'major_concern';
export type Priority = 'quality' | 'reliability' | 'affordability';

export type LLMInfo = {
  id: string;
  name: string;
  provider: string;
  tagline: string;
  scores: {
    quality: number;       // 1-10
    reliability: number;   // 1-10
    affordability: number; // 1-10
  };
  speedTier: 'fast' | 'standard' | 'thorough';
  costTier: 'budget' | 'standard' | 'premium';
  strengthsFor: TaskType[];
  approxCostPer1kTokens: number; // USD
  plainLanguageSummary: string;
};

export type TaskData = {
  task_type: TaskType;
  audience: string;
  success_criteria: string;
  scenario_summary?: string;
};

export type ConstraintsData = {
  deadline_urgency: Urgency;
  budget_sensitivity: Budget;
};

export type PrioritiesData = {
  rank_1: Priority;
  rank_2: Priority;
  rank_3: Priority;
};

export type RecommendationRationale = {
  why: string;
  strengths: string[];
  tradeoffs: string[];
  estimatedCostNote: string;
};

export type RecommendationItem = {
  llm_id: string;
  llm: LLMInfo;
  rank: number;
  weighted_score: number;
  rationale: RecommendationRationale;
};
