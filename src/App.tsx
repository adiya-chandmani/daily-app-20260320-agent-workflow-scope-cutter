import { useMemo, useState } from 'react';
import { buildPlan, type RiskTolerance } from './lib/planner';

const DEFAULT_IDEA = 'AI agent workflow that triages repetitive ops tasks without breaking trust';

export default function App() {
  const [idea, setIdea] = useState(DEFAULT_IDEA);
  const [audience, setAudience] = useState('solo founders and lean ops teams');
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>('low');
  const [deliveryFormat, setDeliveryFormat] = useState<'web' | 'internal-tool' | 'cli'>('web');

  const plan = useMemo(
    () => buildPlan({ idea, audience, riskTolerance, deliveryFormat }),
    [idea, audience, riskTolerance, deliveryFormat]
  );

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Trend-picked build</p>
        <h1>Agent Workflow Scope Cutter</h1>
        <p className="lede">
          AI agent/workflow automation is hot, but most ideas are bloated. This app squeezes a vague idea into a one-day MVP with scope cuts, risks, and build order.
        </p>
      </header>

      <main className="grid">
        <section className="panel form-panel">
          <h2>Describe the idea</h2>
          <label>
            Workflow idea
            <textarea value={idea} onChange={(e) => setIdea(e.target.value)} rows={5} />
          </label>

          <label>
            Target audience
            <input value={audience} onChange={(e) => setAudience(e.target.value)} />
          </label>

          <div className="row">
            <label>
              Risk tolerance
              <select value={riskTolerance} onChange={(e) => setRiskTolerance(e.target.value as RiskTolerance)}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label>
              Delivery format
              <select value={deliveryFormat} onChange={(e) => setDeliveryFormat(e.target.value as 'web' | 'internal-tool' | 'cli')}>
                <option value="web">Web app</option>
                <option value="internal-tool">Internal tool</option>
                <option value="cli">CLI</option>
              </select>
            </label>
          </div>
        </section>

        <section className="panel output-panel">
          <h2>One-day MVP plan</h2>
          <p className="summary">{plan.summary}</p>

          <div className="score-grid">
            <ScoreCard label="Feasibility" value={plan.score.feasibility} />
            <ScoreCard label="Complexity" value={plan.score.complexity} />
            <ScoreCard label="Trend fit" value={plan.score.trendFit} />
          </div>

          <Checklist title="3 core features" items={plan.features} />
          <Checklist title="Explicit scope cuts" items={plan.scopeCuts} />
          <Checklist title="Risk flags" items={plan.risks} />
          <Checklist title="Build checklist" items={plan.buildChecklist} />

          <div className="metric-box">
            <strong>Success metric:</strong> {plan.successMetric}
          </div>
        </section>
      </main>
    </div>
  );
}

function ScoreCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="score-card">
      <span>{label}</span>
      <strong>{value}/100</strong>
    </div>
  );
}

function Checklist({ title, items }: { title: string; items: string[] }) {
  return (
    <section className="list-block">
      <h3>{title}</h3>
      <ul>
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </section>
  );
}
