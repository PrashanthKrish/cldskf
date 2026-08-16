import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { SEGMENTS, SOURCE_REGISTRY } from "../data/taxonomy";
import { fmtDate, fmtSEK } from "../lib/format";
import { runPipeline } from "../agents/orchestrator";
import type { AgentLogEvent } from "../agents/types";
import "./pages.css";

export default function SignalDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { rawQueue, processed, decide } = useAppStore();
  const [localLogs, setLocalLogs] = useState<AgentLogEvent[]>([]);
  const [running, setRunning] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  const raw = rawQueue.find((s) => s.id === id);
  const proc = id ? processed[id] : undefined;

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [localLogs]);

  if (!raw) {
    return (
      <div>
        <Link className="back-link" to="/">
          ← Back to Weekly Digest
        </Link>
        <div className="empty-state">Signal not found.</div>
      </div>
    );
  }

  const source = SOURCE_REGISTRY.find((s) => s.id === raw.sourceId);

  async function handleRunTrace() {
    setRunning(true);
    setLocalLogs([]);
    const gen = runPipeline(raw!);
    let result = await gen.next();
    while (!result.done) {
      setLocalLogs((prev) => [...prev, result.value as AgentLogEvent]);
      result = await gen.next();
    }
    useAppStore.setState((state) => ({
      processed: { ...state.processed, [result.value.id]: result.value },
    }));
    setRunning(false);
  }

  return (
    <div>
      <Link className="back-link" to="/">
        ← Back to Weekly Digest
      </Link>

      <div className="intro" style={{ marginBottom: 20 }}>
        <h2>{raw.title}</h2>
        <p>
          {raw.titleCn} · Source: {source?.name} · Published {fmtDate(raw.publishedAt)} · Est. value{" "}
          {fmtSEK(raw.estValueSEK)}
        </p>
      </div>

      <div className="detail-grid">
        <div>
          <div className="detail-card">
            <h3>Raw signal text</h3>
            <p style={{ fontSize: 13.5, lineHeight: 1.7, color: "#333" }}>{raw.body}</p>
          </div>

          {!proc && (
            <div className="detail-card">
              <h3>Agent trace</h3>
              <p className="note" style={{ marginTop: 0, marginBottom: 12 }}>
                This signal hasn't been processed yet. Run the pipeline to see each agent's step live.
              </p>
              <button className="btn primary" onClick={handleRunTrace} disabled={running}>
                {running ? "Running agents…" : "Run agent pipeline on this signal"}
              </button>
              {localLogs.length > 0 && (
                <div className="console-log" style={{ height: 220, marginTop: 14 }} ref={logRef}>
                  {localLogs.map((log) => (
                    <div className="log-line" key={log.id}>
                      <span className={"log-agent " + log.level}>[{log.agent}]</span>
                      <span>{log.message}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {proc && (
            <div className="detail-card">
              <h3>Classification agent — segment scores</h3>
              <div className="score-bars">
                {proc.classification.segmentScores.map((s) => {
                  const seg = SEGMENTS.find((sg) => sg.id === s.segmentId)!;
                  return (
                    <div className="score-bar-row" key={s.segmentId}>
                      <div>{seg.name}</div>
                      <div className="score-bar-track">
                        <div className="score-bar-fill" style={{ width: `${s.score}%` }} />
                      </div>
                      <div style={{ textAlign: "right", fontWeight: 700 }}>{s.score}</div>
                    </div>
                  );
                })}
              </div>
              {proc.classification.segmentScores[0]?.matchedTerms.length > 0 && (
                <p className="note">
                  Matched terms (top segment):{" "}
                  {proc.classification.segmentScores[0].matchedTerms.join(", ")}
                </p>
              )}
            </div>
          )}

          {proc && (
            <div className="detail-card">
              <h3>Qualification agent — rationale</h3>
              <ul className="rationale-list">
                {proc.qualification.rationale.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              <h3 style={{ marginTop: 18 }}>Suggested first approach</h3>
              <div className="approach-box">{proc.qualification.suggestedApproach}</div>
            </div>
          )}
        </div>

        <div>
          <div className="detail-card">
            <h3>Signal summary</h3>
            <div className="field-row">
              <span className="k">Signal ID</span>
              <span className="v mono">{raw.id}</span>
            </div>
            <div className="field-row">
              <span className="k">Source</span>
              <span className="v">{source?.name}</span>
            </div>
            <div className="field-row">
              <span className="k">Estimated value</span>
              <span className="v">{fmtSEK(raw.estValueSEK)}</span>
            </div>
            {proc && (
              <>
                <div className="field-row">
                  <span className="k">Detected language</span>
                  <span className="v">{proc.classification.language.toUpperCase()}</span>
                </div>
                <div className="field-row">
                  <span className="k">Relevance score</span>
                  <span className="v">{proc.qualification.relevanceScore} / 100</span>
                </div>
                <div className="field-row">
                  <span className="k">Recommendation</span>
                  <span className={"status-pill status-" + proc.qualification.recommendation}>
                    {proc.qualification.recommendation}
                  </span>
                </div>
                <div className="field-row">
                  <span className="k">Account match</span>
                  <span className="v">
                    {proc.entity.isNewProspect ? "New prospect" : proc.entity.accountName}
                  </span>
                </div>
                {!proc.entity.isNewProspect && (
                  <div className="field-row">
                    <span className="k">Match confidence</span>
                    <span className="v">{(proc.entity.confidence * 100).toFixed(0)}%</span>
                  </div>
                )}
                <div className="field-row">
                  <span className="k">Status</span>
                  <span className={"status-pill status-" + proc.status}>{proc.status}</span>
                </div>
              </>
            )}
          </div>

          {proc && proc.status === "pending" && (
            <div className="detail-card">
              <h3>Decision</h3>
              <p className="note" style={{ marginTop: 0 }}>
                Accepting creates a qualified opportunity in the Routed Pipeline. Rejecting feeds the
                sales-acceptance training label set used to recalibrate the Qualification agent.
              </p>
              <div className="decision-actions">
                <button
                  className="btn primary"
                  onClick={() => {
                    decide(raw.id, "accepted");
                    navigate("/pipeline");
                  }}
                >
                  Accept → route to pipeline
                </button>
                <button className="btn danger" onClick={() => decide(raw.id, "rejected")}>
                  Reject
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
