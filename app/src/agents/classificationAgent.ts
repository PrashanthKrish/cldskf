import { SEGMENTS } from "../data/taxonomy";
import type { RawSignal } from "../data/signals";
import type { ClassificationResult, SegmentMatch } from "./types";
import { countOccurrences, detectLanguage } from "./textUtils";

/**
 * Classification Agent — term-frequency relevance scoring against the
 * priority-segment keyword taxonomy (bilingual EN/ZH). This stands in for
 * the "Chinese-language NLP ingestion and classification" step in the
 * source spec (§A2 AI technique) without calling any external model:
 * every weighted keyword hit against title+body raises that segment's score.
 */
export function classifySignal(raw: RawSignal): ClassificationResult {
  const text = `${raw.title} ${raw.titleCn} ${raw.body}`;

  const segmentScores: SegmentMatch[] = SEGMENTS.map((segment) => {
    let raw_score = 0;
    const matchedTerms: string[] = [];
    for (const { term, weight } of segment.keywords) {
      const hits = countOccurrences(text, term);
      if (hits > 0) {
        raw_score += hits * weight;
        matchedTerms.push(term);
      }
    }
    // Normalize against the segment's maximum possible weighted score so
    // segments with more keywords aren't unfairly favoured.
    const maxPossible = segment.keywords.reduce((s, k) => s + k.weight, 0);
    const score = Math.min(100, Math.round((raw_score / maxPossible) * 100));
    return { segmentId: segment.id, score, matchedTerms };
  }).sort((a, b) => b.score - a.score);

  const primarySegmentId =
    segmentScores[0] && segmentScores[0].score > 0 ? segmentScores[0].segmentId : "general";

  return {
    primarySegmentId,
    segmentScores,
    language: detectLanguage(text),
  };
}
