# Optus Conversational AI Demo — Resolve, Preserve, Then Grow

A self-contained, front-end-only prototype for the TCS × Optus Use Case 1 brief: AI-led technical
support with human handoff and responsible next-best-action recommendation. English-only build.

**Live:** `https://<your-pages-domain>/optus/` once GitHub Pages redeploys from `/docs`.

## What this is

A deterministic, scripted simulation of one customer interaction (Priya Sharma → Olivia the AI
agent → Daniel the human specialist), built entirely from `optus-uc1-synthetic-data.json` /
`optus-uc1-prd.md` (see the repo root for the source brief). No backend, no network calls, no
LLM inference — every line of dialogue, every diagnostic result and every metric is pre-authored
synthetic content, revealed turn-by-turn as the presenter clicks through.

Three claims the screens are built to prove:
1. The AI does real telco work (diagnostics with evidence), not scripted chat.
2. Nothing is lost when the call hands off to a human agent.
3. The product recommendation is gated — it only unlocks after the service issue is actioned
   **and** the customer has confirmed they actually need it.

## Running it

No build step. Serve the folder statically and open `index.html`:

```bash
cd docs/optus
python3 -m http.server 8080
# open http://localhost:8080/
```

## Files

- `data.js` — all synthetic content (customer, conversation turns, diagnostics, offers, metrics,
  TCS agent catalogue, audit log), transcribed from the source JSON.
- `app.js` — the whole application: state machine, routing, screen rendering, event handling.
- `styles.css` — design tokens and component styles.
- `walkthrough.js` — the presenter autoplay bot (see below).

## The offer gate (single source of truth)

```js
offerGateMet = ticket.created && topup.applied && coverageGapConfirmed
offerAddable = offerGateMet && all 5 required compliance items ticked
```

## The presenter walkthrough control

There's a small, near-invisible dot in the **bottom-right corner** of every screen
(`#walkthrough-hotspot`, ~14px, ~10% opacity at rest). Click it once and it plays the entire demo
itself — moving a simulated cursor, clicking every button, typing the PIN, ticking every
compliance checkbox — exactly as a presenter would, narrating each beat with a caption. Click the
same dot again at any point to stop immediately. Clicking it resets the demo to the start each
time it's launched, so it's safe to run repeatedly.

## Scope decisions vs. the original PRD

- **English only** (no Simplified Chinese toggle) — per product decision.
- Plain HTML/CSS/JS with no build step (matching this repo's existing prototype convention),
  rather than the React/Vite/TypeScript stack in the original brief.
- Charts are hand-rolled inline SVG rather than a charting library, to keep the demo dependency-free.
- The audit log (34 events) is the fixed, authored log from the data file rather than a live
  event-append system — still fully viewable from the Value Dashboard.
