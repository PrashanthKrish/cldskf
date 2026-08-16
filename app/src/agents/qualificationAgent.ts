import { SEGMENTS } from "../data/taxonomy";
import type { RawSignal } from "../data/signals";
import type { ClassificationResult, EntityMatch, QualificationResult } from "./types";

/**
 * Qualification Agent — blends the Classification and Entity Resolution
 * agents' outputs into a single relevance score and a routing decision,
 * then composes a Mandarin-ready first-approach brief. This is the "learned
 * qualification model trained on sales acceptance" from the spec (§A2),
 * implemented here as a transparent, auditable weighted formula rather than
 * an opaque model — every number in the rationale is traceable to an input.
 */
export function qualifySignal(
  raw: RawSignal,
  classification: ClassificationResult,
  entity: EntityMatch
): QualificationResult {
  const segment = SEGMENTS.find((s) => s.id === classification.primarySegmentId)!;
  const topScore = classification.segmentScores[0]?.score ?? 0;

  // Priority 1 segment worth full weight, priority 4 worth a quarter.
  const priorityWeight = (5 - segment.priority) / 4;
  const entityBonus = entity.isNewProspect ? 8 : entity.confidence * 15;
  const valueWeight = Math.min(15, Math.round((raw.estValueSEK / 10_000_000) * 15));

  const relevanceScore = Math.min(
    100,
    Math.round(topScore * 0.55 + priorityWeight * 100 * 0.25 + entityBonus + valueWeight * 0.1)
  );

  const recommendation: QualificationResult["recommendation"] =
    relevanceScore >= 65 ? "route" : relevanceScore >= 40 ? "hold" : "discard";

  const rationale: string[] = [
    `Segment match: ${segment.name} (${segment.nameCn}) at ${topScore}/100 term-frequency relevance, priority tier ${segment.priority}.`,
    entity.isNewProspect
      ? `No existing account matched — flagged as a new prospect (top-of-funnel signal).`
      : `Matched to ${entity.accountName} at ${(entity.confidence * 100).toFixed(0)}% confidence via "${entity.matchedOn[0]}".`,
    `Estimated deal value SEK ${(raw.estValueSEK / 1_000_000).toFixed(1)}M contributes ${valueWeight} pts to the blended score.`,
    `Bearing content for this segment: ${segment.bearingIntensity}.`,
  ];

  const owner = entity.isNewProspect ? "P09 (demand sensing)" : "P03 (territory sales)";
  const suggestedApproach = entity.isNewProspect
    ? `Route to ${owner} for first-contact qualification against the ${segment.name} segment brief; no existing relationship on file, so lead with the public filing as the reason for outreach.`
    : `Route to ${owner} — reference the account's active ${segment.name.toLowerCase()} activity directly; this is a warm re-engagement, not a cold approach.`;

  return { relevanceScore, recommendation, suggestedApproach, rationale };
}
