import { LLMInfo } from './decision-types';

// Static LLM catalog. Scores are 1-10 and are editorial, calibrated against
// publicly reported benchmarks and pricing as of early 2025. Plain-language
// copy is written for non-technical professionals.
export const LLM_CATALOG: LLMInfo[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    tagline: 'Top-shelf quality for important work',
    scores: { quality: 9.5, reliability: 9.0, affordability: 6.0 },
    speedTier: 'standard',
    costTier: 'premium',
    strengthsFor: [
      'draft_communication',
      'research_synthesis',
      'data_analysis',
      'technical_question',
    ],
    approxCostPer1kTokens: 0.005,
    plainLanguageSummary:
      'Best-in-class for nuanced writing and reasoning. Choose it when the stakes are high and polish matters more than cost.',
  },
  {
    id: 'gpt-4o-mini',
    name: 'GPT-4o mini',
    provider: 'OpenAI',
    tagline: 'Fast and affordable everyday workhorse',
    scores: { quality: 8.0, reliability: 8.5, affordability: 9.0 },
    speedTier: 'fast',
    costTier: 'budget',
    strengthsFor: [
      'draft_communication',
      'summarize_document',
      'brainstorm_ideas',
      'translate_rewrite',
    ],
    approxCostPer1kTokens: 0.0003,
    plainLanguageSummary:
      'Great balance of quality and price for routine writing, summaries, and quick turnarounds. A safe default for most daily tasks.',
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    tagline: 'Thoughtful, long-form writing specialist',
    scores: { quality: 9.3, reliability: 9.2, affordability: 6.5 },
    speedTier: 'standard',
    costTier: 'premium',
    strengthsFor: [
      'draft_communication',
      'research_synthesis',
      'summarize_document',
      'technical_question',
    ],
    approxCostPer1kTokens: 0.003,
    plainLanguageSummary:
      'Excellent at careful, well-reasoned prose and handling long documents. Choose it for polished reports and thoughtful communication.',
  },
  {
    id: 'claude-3-5-haiku',
    name: 'Claude 3.5 Haiku',
    provider: 'Anthropic',
    tagline: 'Quick, consistent help on a budget',
    scores: { quality: 7.8, reliability: 8.8, affordability: 9.2 },
    speedTier: 'fast',
    costTier: 'budget',
    strengthsFor: [
      'summarize_document',
      'translate_rewrite',
      'brainstorm_ideas',
      'draft_communication',
    ],
    approxCostPer1kTokens: 0.0008,
    plainLanguageSummary:
      'Cost-effective and dependable for shorter tasks like summaries and rewrites. Pick it when speed and price matter most.',
  },
  {
    id: 'gemini-2-0-pro',
    name: 'Gemini 2.0 Pro',
    provider: 'Google',
    tagline: 'Strong at research and large-context work',
    scores: { quality: 8.8, reliability: 8.3, affordability: 7.5 },
    speedTier: 'standard',
    costTier: 'standard',
    strengthsFor: [
      'research_synthesis',
      'data_analysis',
      'summarize_document',
      'technical_question',
    ],
    approxCostPer1kTokens: 0.00125,
    plainLanguageSummary:
      'Handles very large inputs well and is solid for analysis and research. Good middle-ground choice for heavy reading tasks.',
  },
  {
    id: 'gemini-2-0-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    tagline: 'Near-instant responses for fast turnarounds',
    scores: { quality: 7.5, reliability: 8.2, affordability: 9.5 },
    speedTier: 'fast',
    costTier: 'budget',
    strengthsFor: [
      'brainstorm_ideas',
      'summarize_document',
      'translate_rewrite',
      'draft_communication',
    ],
    approxCostPer1kTokens: 0.00015,
    plainLanguageSummary:
      'Extremely affordable and fast. Use it for quick drafts, brainstorms, and anything you need right now.',
  },
  {
    id: 'llama-3-1-70b',
    name: 'Llama 3.1 70B',
    provider: 'Meta',
    tagline: 'Open-weight model, low-cost via providers',
    scores: { quality: 8.2, reliability: 7.8, affordability: 8.8 },
    speedTier: 'standard',
    costTier: 'budget',
    strengthsFor: [
      'brainstorm_ideas',
      'draft_communication',
      'technical_question',
      'other',
    ],
    approxCostPer1kTokens: 0.0006,
    plainLanguageSummary:
      'Capable general-purpose model at a friendly price through most cloud providers. Good fallback if you want options beyond the big brands.',
  },
  {
    id: 'mistral-large',
    name: 'Mistral Large',
    provider: 'Mistral',
    tagline: 'European option with balanced performance',
    scores: { quality: 8.3, reliability: 8.0, affordability: 7.2 },
    speedTier: 'standard',
    costTier: 'standard',
    strengthsFor: [
      'translate_rewrite',
      'draft_communication',
      'summarize_document',
      'technical_question',
    ],
    approxCostPer1kTokens: 0.002,
    plainLanguageSummary:
      'Balanced model with strong multilingual skills. Worth a look when language variety or EU-based providers matter.',
  },
];

export function getLLMById(id: string): LLMInfo | undefined {
  return LLM_CATALOG.find((l) => l.id === id);
}

export const TASK_TYPE_LABELS: Record<string, string> = {
  draft_communication: 'Draft an email, memo, or other communication',
  summarize_document: 'Summarize a document or long text',
  data_analysis: 'Help analyze data or spot patterns',
  research_synthesis: 'Research a topic and synthesize findings',
  brainstorm_ideas: 'Brainstorm ideas or options',
  translate_rewrite: 'Translate or rewrite in a different tone',
  technical_question: 'Answer a technical or specialized question',
  other: 'Something else',
};
