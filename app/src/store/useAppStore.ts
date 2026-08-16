import { create } from "zustand";
import { persist } from "zustand/middleware";
import { RAW_SIGNALS, type RawSignal } from "../data/signals";
import { SOURCE_REGISTRY } from "../data/taxonomy";
import { runPipeline } from "../agents/orchestrator";
import type { AgentLogEvent, ProcessedSignal } from "../agents/types";

export interface PipelineOpportunity {
  signalId: string;
  title: string;
  segmentId: string;
  owner: string;
  estValueSEK: number;
  createdAt: string;
  sourceId: string;
}

interface AppState {
  rawQueue: RawSignal[];
  processed: Record<string, ProcessedSignal>;
  logs: AgentLogEvent[];
  isRunning: boolean;
  runProgress: { current: number; total: number } | null;
  opportunities: PipelineOpportunity[];
  sources: typeof SOURCE_REGISTRY;

  runAll: () => Promise<void>;
  runOne: (signalId: string) => Promise<void>;
  ingestCustomSignal: (signal: RawSignal) => Promise<void>;
  decide: (signalId: string, decision: "accepted" | "rejected") => void;
  toggleSource: (sourceId: string) => void;
  clearLogs: () => void;
  reset: () => void;
}

const MAX_LOGS = 400;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      rawQueue: RAW_SIGNALS,
      processed: {},
      logs: [],
      isRunning: false,
      runProgress: null,
      opportunities: [],
      sources: SOURCE_REGISTRY,

      runOne: async (signalId: string) => {
        const raw = get().rawQueue.find((s) => s.id === signalId);
        if (!raw) return;
        set({ isRunning: true });
        const gen = runPipeline(raw);
        let result = await gen.next();
        while (!result.done) {
          const event = result.value;
          set((state) => ({ logs: [...state.logs, event].slice(-MAX_LOGS) }));
          result = await gen.next();
        }
        const processed = result.value;
        set((state) => ({
          processed: { ...state.processed, [processed.id]: processed },
          isRunning: false,
        }));
      },

      runAll: async () => {
        const queue = get().rawQueue.filter((s) => !get().processed[s.id]);
        if (queue.length === 0) return;
        set({ isRunning: true, runProgress: { current: 0, total: queue.length } });
        for (let i = 0; i < queue.length; i++) {
          const raw = queue[i];
          const gen = runPipeline(raw);
          let result = await gen.next();
          while (!result.done) {
            const event = result.value;
            set((state) => ({ logs: [...state.logs, event].slice(-MAX_LOGS) }));
            result = await gen.next();
          }
          const processed = result.value;
          set((state) => ({
            processed: { ...state.processed, [processed.id]: processed },
            runProgress: { current: i + 1, total: queue.length },
          }));
        }
        set({ isRunning: false, runProgress: null });
      },

      ingestCustomSignal: async (signal: RawSignal) => {
        set((state) => ({ rawQueue: [signal, ...state.rawQueue] }));
        await get().runOne(signal.id);
      },

      decide: (signalId: string, decision: "accepted" | "rejected") => {
        set((state) => {
          const proc = state.processed[signalId];
          if (!proc) return state;
          const updated: ProcessedSignal = { ...proc, status: decision };
          const opportunities =
            decision === "accepted"
              ? [
                  {
                    signalId,
                    title: proc.raw.title,
                    segmentId: proc.classification.primarySegmentId,
                    owner: proc.entity.isNewProspect ? "P09 — Demand Sensing" : "P03 — Territory Sales",
                    estValueSEK: proc.raw.estValueSEK,
                    createdAt: new Date().toISOString(),
                    sourceId: proc.raw.sourceId,
                  },
                  ...state.opportunities,
                ]
              : state.opportunities;
          return {
            processed: { ...state.processed, [signalId]: updated },
            opportunities,
          };
        });
      },

      toggleSource: (sourceId: string) => {
        set((state) => ({
          sources: state.sources.map((s) => (s.id === sourceId ? { ...s, enabled: !s.enabled } : s)),
        }));
      },

      clearLogs: () => set({ logs: [] }),

      reset: () =>
        set({
          rawQueue: RAW_SIGNALS,
          processed: {},
          logs: [],
          isRunning: false,
          runProgress: null,
          opportunities: [],
          sources: SOURCE_REGISTRY,
        }),
    }),
    { name: "demand-signal-radar-store" }
  )
);
