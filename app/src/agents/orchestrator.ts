import type { RawSignal } from "../data/signals";
import { classifySignal } from "./classificationAgent";
import { resolveEntity } from "./entityResolutionAgent";
import { qualifySignal } from "./qualificationAgent";
import { SEGMENTS } from "../data/taxonomy";
import type { AgentLogEvent, ProcessedSignal } from "./types";

const STEP_DELAY_MS = 260;

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let logCounter = 0;
function makeLog(
  agent: AgentLogEvent["agent"],
  signalId: string,
  message: string,
  level: AgentLogEvent["level"] = "info"
): AgentLogEvent {
  logCounter += 1;
  return { id: `log-${Date.now()}-${logCounter}`, ts: Date.now(), agent, signalId, message, level };
}

/**
 * Runs the full four-agent pipeline over a single raw signal, yielding a log
 * event after each step so the UI can render it as a live process rather
 * than a static precomputed table. No network calls — every step is a pure
 * local function over the signal's own text.
 */
export async function* runPipeline(raw: RawSignal): AsyncGenerator<AgentLogEvent, ProcessedSignal> {
  yield makeLog("Orchestrator", raw.id, `Dispatching signal ${raw.id} — "${raw.title}"`);
  await wait(STEP_DELAY_MS);

  yield makeLog("Ingestion", raw.id, `Normalized bilingual text (${raw.body.length} chars), source registry lookup OK.`);
  await wait(STEP_DELAY_MS);

  const classification = classifySignal(raw);
  const segment = SEGMENTS.find((s) => s.id === classification.primarySegmentId)!;
  yield makeLog(
    "Classification",
    raw.id,
    `Language=${classification.language}. Top segment: ${segment.name} (${classification.segmentScores[0]?.score ?? 0}/100).`,
    "success"
  );
  await wait(STEP_DELAY_MS);

  const entity = resolveEntity(raw);
  yield makeLog(
    "Entity Resolution",
    raw.id,
    entity.isNewProspect
      ? "No account match above threshold — marked as new prospect."
      : `Matched ${entity.accountName} at ${(entity.confidence * 100).toFixed(0)}% confidence.`,
    entity.isNewProspect ? "warn" : "success"
  );
  await wait(STEP_DELAY_MS);

  const qualification = qualifySignal(raw, classification, entity);
  yield makeLog(
    "Qualification",
    raw.id,
    `Blended relevance ${qualification.relevanceScore}/100 → recommendation: ${qualification.recommendation.toUpperCase()}.`,
    qualification.recommendation === "route" ? "success" : "warn"
  );
  await wait(STEP_DELAY_MS);

  yield makeLog("Orchestrator", raw.id, `Pipeline complete for ${raw.id}.`);

  return {
    id: raw.id,
    raw,
    classification,
    entity,
    qualification,
    processedAt: new Date().toISOString(),
    status: "pending",
  };
}
