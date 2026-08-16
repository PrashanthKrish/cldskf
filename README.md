# SKF CNEA · Demand Signal Radar

A functioning React application for **Lever A (Sales Growth), Challenge A2 — "Demand-signal blindness in
the high-growth segments SKF has chosen to win"** — from the *SKF China (CNEA) AI Growth Levers* strategy
document.

## The problem

SKF has no systematic way to detect, qualify and route Chinese-language opportunity signals — public
tenders, provincial equipment-renewal subsidy catalogues, MIIT smart-factory designations, OEM launches,
robotics funding rounds — into the sales pipeline while they are still actionable. Today this depends on
individual relationships, trade shows, and inbound enquiry. Meanwhile SKF has committed capital to named
growth segments (the Leaderdrive humanoid robotics JV, wind repowering, EV powertrain, the national
equipment-renewal programme) whose demand signals are public, in Chinese, and largely unread.

## The solution — live demo

**[Open the application](https://prashanthkrish.github.io/cldskf/)**

A React single-page application built around a **four-agent processing pipeline** that runs entirely in
the browser — no backend, no external APIs, no integrations:

| Agent | What it actually does |
|---|---|
| **Ingestion** | Normalizes each bilingual (EN/中文) raw signal record and confirms its source registration |
| **Classification** | Term-frequency relevance scoring against a weighted, bilingual keyword taxonomy for each priority growth segment (robotics, equipment renewal, wind repowering, EV powertrain) |
| **Entity Resolution** | Fuzzy-matches the signal text against a synthetic account registry using bigram (character n-gram) similarity — genuinely computed, not looked up from a fixture |
| **Qualification** | Blends the classification score, entity-match confidence, segment priority and deal value into an auditable relevance score, a route/hold/discard recommendation, and a generated first-approach brief, with every number in the rationale traceable to an input |

The pipeline is a real, running process, not a canned animation: paste your own bilingual signal text into
the Agent Console's ingestion form and the same four agents compute a genuine score and match against it.

**Pages:**
- **Weekly Digest** — the ranked signal queue, KPIs (tracking the source document's own targets), and the
  "run all" control
- **Agent Console** — a live scrolling log of each agent's step for every signal processed, plus the
  free-text signal-submission form
- **Signal Detail** — per-signal drill-down: segment score breakdown, matched keywords, entity-match
  confidence, qualification rationale, suggested approach, and the accept/reject decision
- **Routed Pipeline** — opportunities created by accepting a signal
- **Sources** — the monitored source registry with enable/disable toggles

State (processed signals, decisions, routed opportunities, source toggles) persists to `localStorage`, so
the application behaves like a real stateful tool across reloads, not a stateless demo.

This mirrors the MVP scope in the spec: *"three segments, three source types, weekly digest, manual
acceptance,"* implemented as working software rather than a mock.

## Design thinking

1. **Read the source strategy doc** to find Lever A → the six ranked "pains" (A1–A6), and picked
   **A2 (challenge 2)**: demand-signal blindness — the only Lever A pain that grows the top of the funnel
   rather than improving conversion of demand that already exists.
2. **Extracted the spec's own success criteria** (weekly ranked digest, source link, estimated bearing
   content, suggested approach; ≥15% pipeline attribution; ≥30% acceptance precision; ≤72h lag; 100%
   priority-segment coverage) and built the UI and KPI strip directly around those metrics.
3. **Turned the spec's named AI techniques into real local logic** instead of a static mockup: "Chinese-
   language NLP ingestion and classification" → an actual bilingual term-frequency scorer against a
   segment keyword taxonomy; "entity resolution... at ≥95% accuracy" → an actual bigram-similarity fuzzy
   matcher against a synthetic account registry; "a learned qualification model" → a transparent, weighted
   blend function with a fully auditable rationale (matching the spec's own emphasis on auditability over
   opaque scoring). No external AI/LLM API is called — every "agent" is a pure, inspectable function
   chained by an orchestrator that yields a log event per step, which is what the Agent Console renders
   live.
4. **Scoped to the stated MVP**, not the "Full" version — no live web-scraping ingestion, no production
   CRM write-back — but a genuinely interactive, stateful application that demonstrates the full workflow
   (ingest → classify → match → qualify → accept/reject → pipeline) end to end, including the ability to
   submit new signals and watch them processed live.
5. **Applied SKF's 2025 brand identity** (navy/white palette, flat hard-edged components, sparing single
   accent colors per section, geometric sans typography) so the artifact reads as an SKF-owned tool.

## Tech

- React 19 + TypeScript, built with Vite
- `react-router-dom` (`HashRouter`, so static hosting needs no server-side rewrites)
- `zustand` with the `persist` middleware for app state
- No UI framework/component library — hand-built components styled to the SKF brand reference
- Zero runtime dependencies on any external API, model, or backend — the "AI agents" are deterministic
  TypeScript modules under `app/src/agents/`

## Running locally

```bash
cd app
npm install
npm run dev
```

## Project structure

```
app/
  src/
    agents/        # the four-agent pipeline + orchestrator
    data/           # synthetic taxonomy, accounts, and raw signal feed
    store/          # zustand app state (persisted)
    pages/          # Dashboard, Agent Console, Signal Detail, Pipeline, Sources
    components/     # shared UI (KPI row, etc.)
```

Hosted on GitHub Pages (`gh-pages` branch, built by `.github/workflows/pages.yml` on every push to
`main`/this branch).

## Tools used

Claude Code — read and extracted the strategy specification (docx) and brand reference (md), selected the
challenge, designed and implemented the React application and its agent pipeline, tested it end-to-end
with a headless browser, and pushed/hosted the result.
