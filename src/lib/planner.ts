export type RiskTolerance = 'low' | 'medium' | 'high';

export type PlanInput = {
  idea: string;
  audience: string;
  riskTolerance: RiskTolerance;
  deliveryFormat: 'web' | 'internal-tool' | 'cli';
};

export type PlanOutput = {
  summary: string;
  score: {
    feasibility: number;
    complexity: number;
    trendFit: number;
  };
  features: string[];
  scopeCuts: string[];
  risks: string[];
  buildChecklist: string[];
  successMetric: string;
};

const KEYWORD_MAP = [
  {
    match: ['support', 'ticket', 'inbox', 'triage', 'email'],
    features: [
      'Classify incoming requests into 3 urgency levels with plain-language reasons.',
      'Generate a one-screen action queue with recommended next step for each item.',
      'Export a lightweight JSON summary for handoff or audit.'
    ],
    risks: ['Hallucinated urgency can create noisy prioritization.', 'Edge cases need human review before action.'],
    metric: 'A user can sort 10 requests into a same-day action queue in under 3 minutes.'
  },
  {
    match: ['content', 'marketing', 'social', 'viral', 'repurpose'],
    features: [
      'Turn one source idea into multiple channel-ready content angles.',
      'Highlight which outputs are safe for a one-person workflow versus team review.',
      'Generate a publish checklist to reduce “post and regret” moments.'
    ],
    risks: ['Generated copy can feel generic without sharp prompts.', 'Trend half-life is short, so templates must be lightweight.'],
    metric: 'A creator can turn one idea into 5 usable variations in under 5 minutes.'
  },
  {
    match: ['agent', 'workflow', 'automation', 'ops', 'process'],
    features: [
      'Break an AI workflow idea into one-day MVP slices.',
      'Flag risky automation steps that should stay manual in v1.',
      'Produce a build checklist with implementation order and test focus.'
    ],
    risks: ['Users may overestimate what can be safely automated.', 'Integrations can explode scope if not cut early.'],
    metric: 'A builder can turn a vague agent idea into a shippable one-day scope with clear cuts.'
  }
];

function pickPreset(idea: string) {
  const lower = idea.toLowerCase();
  return (
    KEYWORD_MAP.find((preset) => preset.match.some((token) => lower.includes(token))) ??
    KEYWORD_MAP[2]
  );
}

function scoreFeasibility(input: PlanInput) {
  const words = input.idea.trim().split(/\s+/).filter(Boolean).length;
  const base = words > 25 ? 62 : 78;
  const riskPenalty = input.riskTolerance === 'low' ? 0 : input.riskTolerance === 'medium' ? 6 : 12;
  const formatBonus = input.deliveryFormat === 'web' ? 6 : input.deliveryFormat === 'cli' ? 10 : 4;
  return Math.max(40, Math.min(95, base + formatBonus - riskPenalty));
}

function scoreComplexity(input: PlanInput) {
  const integrationPenalty = /(slack|gmail|calendar|stripe|github|notion|zapier|shopify)/i.test(input.idea) ? 20 : 8;
  const formatPenalty = input.deliveryFormat === 'web' ? 12 : input.deliveryFormat === 'internal-tool' ? 10 : 6;
  return Math.max(20, Math.min(95, 30 + integrationPenalty + formatPenalty));
}

function scoreTrendFit(input: PlanInput) {
  const trendTokens = /(agent|automation|workflow|ai|assistant|copilot)/i.test(input.idea) ? 88 : 70;
  const audienceBoost = input.audience.trim().length > 0 ? 4 : 0;
  return Math.min(96, trendTokens + audienceBoost);
}

export function buildPlan(input: PlanInput): PlanOutput {
  const preset = pickPreset(input.idea);
  const feasibility = scoreFeasibility(input);
  const complexity = scoreComplexity(input);
  const trendFit = scoreTrendFit(input);

  const scopeCuts = [
    'No third-party API integrations in v1 unless they are absolutely required for the demo.',
    'No background jobs, auth system, billing, or multi-user collaboration.',
    'No autonomous actions on behalf of the user; recommendations only.'
  ];

  if (input.riskTolerance === 'high') {
    scopeCuts.push('Skip polish-heavy UI work and focus on one reliable end-to-end flow.');
  }

  const checklist = [
    'Define one input form and one results screen.',
    'Implement the scoring/scope engine first.',
    'Add explanatory copy for why each feature is in scope.',
    'Write 2–3 logic tests for the planner.',
    'Run build + test before shipping.'
  ];

  return {
    summary: `For ${input.audience || 'builders'}, this app turns “${input.idea.trim()}” into a focused ${input.deliveryFormat} MVP plan with realistic cuts.` ,
    score: { feasibility, complexity, trendFit },
    features: preset.features,
    scopeCuts,
    risks: preset.risks,
    buildChecklist: checklist,
    successMetric: preset.metric
  };
}
