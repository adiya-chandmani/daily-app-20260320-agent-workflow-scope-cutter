import { describe, expect, it } from 'vitest';
import { buildPlan } from './planner';

describe('buildPlan', () => {
  it('returns workflow-focused features for agent ideas', () => {
    const plan = buildPlan({
      idea: 'AI agent workflow for internal ops automation',
      audience: 'ops team',
      riskTolerance: 'low',
      deliveryFormat: 'web'
    });

    expect(plan.features[0]).toMatch(/one-day MVP/i);
    expect(plan.scopeCuts).toContain('No autonomous actions on behalf of the user; recommendations only.');
  });

  it('adds extra cut for high-risk tolerance', () => {
    const plan = buildPlan({
      idea: 'content repurposing workflow',
      audience: 'creators',
      riskTolerance: 'high',
      deliveryFormat: 'cli'
    });

    expect(plan.scopeCuts.some((item) => item.includes('Skip polish-heavy UI work'))).toBe(true);
    expect(plan.score.feasibility).toBeGreaterThanOrEqual(40);
  });
});
