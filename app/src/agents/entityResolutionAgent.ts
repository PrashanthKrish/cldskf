import { ACCOUNTS } from "../data/accounts";
import type { RawSignal } from "../data/signals";
import type { EntityMatch } from "./types";
import { similarity } from "./textUtils";

const MATCH_THRESHOLD = 0.12;

/**
 * Entity Resolution Agent — fuzzy-matches the signal text against the
 * known-account registry using bigram similarity over each account's name,
 * Chinese name, and aliases. Mirrors the spec's "entity resolution against
 * customer/prospect" requirement (§A2), run locally with no CRM integration.
 */
export function resolveEntity(raw: RawSignal): EntityMatch {
  const text = `${raw.title} ${raw.titleCn} ${raw.body}`;

  let best: { accountId: string; accountName: string; score: number; term: string } | null = null;

  for (const account of ACCOUNTS) {
    const candidates = [account.name, account.nameCn, ...account.aliases];
    for (const candidate of candidates) {
      const score = similarity(text, candidate);
      if (!best || score > best.score) {
        best = { accountId: account.id, accountName: account.name, score, term: candidate };
      }
    }
  }

  if (best && best.score >= MATCH_THRESHOLD) {
    return {
      accountId: best.accountId,
      accountName: best.accountName,
      confidence: Math.min(1, best.score * 3), // scale bigram overlap into a readable confidence
      matchedOn: [best.term],
      isNewProspect: false,
    };
  }

  return {
    accountId: null,
    accountName: null,
    confidence: 0,
    matchedOn: [],
    isNewProspect: true,
  };
}
