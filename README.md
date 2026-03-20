# Agent Workflow Scope Cutter

Built on 2026-03-20 from the trend: **AI agent / workflow automation**.

## Problem
AI agent ideas are everywhere right now, but most solo builders and small teams try to ship too much at once.

## Solution
Agent Workflow Scope Cutter turns a vague AI workflow idea into a one-day MVP plan with:
- a plain-English app summary
- 3 core features
- explicit scope cuts
- risk flags
- a build checklist and success metric

## Why this trend
From today's Brave research, AI agent/workflow automation kept appearing across multiple source types (Product Hunt category pages, enterprise/blog explainers, and GitHub/open-source trend coverage), which suggests strong current attention but also lots of bloated, over-scoped product ideas.

## How to run
```bash
npm install
npm run dev
```

## How to test
```bash
npm run test
npm run build
npm run lint
```

## Scope cuts
- No external AI API integration in v1
- No auth, billing, or background jobs
- No autonomous action-taking; recommendation and planning only

## Project structure
- `src/App.tsx` — UI
- `src/lib/planner.ts` — rule-based planning engine
- `src/lib/planner.test.ts` — minimal tests
