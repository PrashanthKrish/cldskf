> Also in this repo: [`docs/optus/`](docs/optus/) — a second, unrelated prototype (TCS × Optus
> Conversational AI demo). See [`docs/optus/README.md`](docs/optus/README.md) for details.

# SKF CNEA · Demand Signal Radar

A minimal prototype for **Lever A (Sales Growth), Challenge A2 — "Demand-signal blindness in the
high-growth segments SKF has chosen to win"** — from the *SKF China (CNEA) AI Growth Levers* strategy
document.

## The problem

SKF has no systematic way to detect, qualify and route Chinese-language opportunity signals — public
tenders, provincial equipment-renewal subsidy catalogues, MIIT smart-factory designations, OEM launches,
robotics funding rounds — into the sales pipeline while they are still actionable. Today this depends on
individual relationships, trade shows, and inbound enquiry. Meanwhile SKF has committed capital to named
growth segments (the Leaderdrive humanoid robotics JV, wind repowering, EV powertrain, the national
equipment-renewal programme) whose demand signals are public, in Chinese, and largely unread.

## The solution — live demo

**[View the prototype](https://prashanthkrish.github.io/cldskf/)**

A single-page dashboard that:
- Ingests illustrative Chinese-language market signals (tenders, renewal filings, robotics/OEM news)
- Scores each for relevance and estimated bearing content
- Resolves each against known SKF accounts (entity resolution)
- Lets a sales user **accept** (→ creates a routed pipeline opportunity) or **reject** (→ feeds the
  training label set) each signal from a weekly ranked digest
- Tracks the KPIs defined in the source document: % of new pipeline from signal detection (target ≥15%),
  signal-to-qualified-opportunity precision, publication→CRM lag (target ≤72h), and segment coverage

This mirrors the MVP scope in the spec: *"three segments, three source types, weekly digest, manual
acceptance."*

## Design thinking

1. **Read the source strategy doc** to find Lever A → the six ranked "pains" (A1–A6), and picked
   **A2 (challenge 2)**: demand-signal blindness — the only Lever A pain that grows the top of the
   funnel rather than improving conversion of demand that already exists.
2. **Extracted the spec's own success criteria** (weekly ranked digest, source link, estimated bearing
   content, suggested approach; ≥15% pipeline attribution; ≥30% acceptance precision; ≤72h lag; 100%
   priority-segment coverage) and built the UI directly around those metrics instead of inventing new ones.
3. **Scoped to the stated MVP**, not the "Full" version — no live ingestion pipeline, no production CRM
   write-back — a static, self-contained interactive prototype that demonstrates the workflow and
   decision loop (triage → score → match → accept/reject → pipeline) end to end with realistic synthetic
   data, matching the `external_signal` / `prospect` / `opportunity` / `sales_acceptance_label` schema
   named in the source document.
4. **Applied SKF's 2025 brand identity** (navy/white palette, flat hard-edged components, sparing single
   accent colors per section, geometric sans typography) so the artifact reads as an SKF-owned tool, not
   a generic dashboard.
5. **Kept it to one page** — a dashboard is the natural form for a "weekly digest you triage," and a
   single static HTML file keeps the prototype trivially hostable and reviewable without a build step.

## Tech

Plain HTML/CSS/JS, no build step, no dependencies. Hosted on GitHub Pages from `/docs`.

## Tools used

Claude Code — read and extracted the strategy specification (docx) and brand reference (md), selected the
challenge, designed and implemented the static prototype, and pushed/hosted the result.
