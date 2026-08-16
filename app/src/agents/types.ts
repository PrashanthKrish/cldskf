import type { RawSignal } from "../data/signals";

export interface SegmentMatch {
  segmentId: string;
  score: number; // 0-100
  matchedTerms: string[];
}

export interface ClassificationResult {
  primarySegmentId: string;
  segmentScores: SegmentMatch[];
  language: "zh" | "en" | "mixed";
}

export interface EntityMatch {
  accountId: string | null;
  accountName: string | null;
  confidence: number; // 0-1
  matchedOn: string[];
  isNewProspect: boolean;
}

export interface QualificationResult {
  relevanceScore: number; // 0-100, blended
  recommendation: "route" | "hold" | "discard";
  suggestedApproach: string;
  rationale: string[];
}

export interface ProcessedSignal {
  id: string;
  raw: RawSignal;
  classification: ClassificationResult;
  entity: EntityMatch;
  qualification: QualificationResult;
  processedAt: string;
  status: "pending" | "accepted" | "rejected";
}

export interface AgentLogEvent {
  id: string;
  ts: number;
  agent: "Ingestion" | "Classification" | "Entity Resolution" | "Qualification" | "Orchestrator";
  signalId: string;
  message: string;
  level: "info" | "success" | "warn";
}
