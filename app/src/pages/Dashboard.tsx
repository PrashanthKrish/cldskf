import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "../store/useAppStore";
import { SEGMENTS } from "../data/taxonomy";
import { KpiRow } from "../components/Kpi";
import { fmtDate } from "../lib/format";
import "./pages.css";

function segmentBadgeClass(segmentId: string) {
  return { renewal: "b-renewal", robotics: "b-robotics", wind: "b-tender", ev: "b-ev", general: "b-general" }[
    segmentId
  ] ?? "b-general";
}

function scoreClass(score: number) {
  return score >= 65 ? "high" : score >= 40 ? "mid" : "low";
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { rawQueue, processed, runAll, isRunning, runProgress } = useAppStore();

  const rows = useMemo(
    () =>
      rawQueue.map((raw) => ({
        raw,
        proc: processed[raw.id],
      })),
    [rawQueue, processed]
  );

  const acceptedCount = Object.values(processed).filter((p) => p.status === "accepted").length;
  const routedCount = Object.values(processed).filter((p) => p.qualification.recommendation === "route").length;
  const processedCount = Object.keys(processed).length;
  const segmentsCovered = new Set(Object.values(processed).map((p) => p.classification.primarySegmentId)).size;

  const kpis = [
    {
      num: rawQueue.length ? `${Math.round((acceptedCount / rawQueue.length) * 100)}%` : "0%",
      label: "New pipeline from signal detection",
      target: "Target ≥ 15% within 12 months",
    },
    {
      num: `${acceptedCount}/${processedCount || rawQueue.length}`,
      label: "Signals accepted / processed",
      target: "Sales-accepted / total routed",
    },
    {
      num: `${routedCount}`,
      label: "Agent-recommended routes this cycle",
      target: "Qualification agent recommendation = route",
    },
    {
      num: `${segmentsCovered}/${SEGMENTS.length - 1}`,
      label: "Priority segments covered",
      target: "Target: 100% of named growth segments monitored",
    },
  ];

  return (
    <div>
      <div className="intro">
        <h2>Demand-signal blindness in high-growth segments</h2>
        <p>
          SKF China currently has no systematic way to detect, qualify and route opportunity signals from
          Chinese-language sources — public tenders, provincial equipment-renewal programmes, OEM launches,
          robotics funding — into the sales pipeline. This dashboard runs a four-agent pipeline (Ingestion →
          Classification → Entity Resolution → Qualification) client-side over each signal and gives Sales a
          rankable weekly digest instead of relying on individual relationships and trade shows.
        </p>
      </div>

      <KpiRow items={kpis} />

      <div className="panel-toolbar">
        <h2>Weekly Digest</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn primary" disabled={isRunning} onClick={() => runAll()}>
            {isRunning ? "Agents running…" : "Run agent pipeline on all pending signals"}
          </button>
        </div>
      </div>

      {runProgress && (
        <div className="progress-bar">
          <div
            className="progress-bar-fill"
            style={{ width: `${(runProgress.current / runProgress.total) * 100}%` }}
          />
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Signal</th>
            <th>Segment</th>
            <th>Relevance</th>
            <th>Account Match</th>
            <th>Recommendation</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ raw, proc }) => (
            <tr key={raw.id} onClick={() => navigate(`/signal/${raw.id}`)}>
              <td>
                <strong>{raw.title}</strong>
                <div className="note" style={{ marginTop: 3 }}>
                  {raw.titleCn} · {fmtDate(raw.publishedAt)}
                </div>
              </td>
              <td>
                {proc ? (
                  <span className={"badge " + segmentBadgeClass(proc.classification.primarySegmentId)}>
                    {SEGMENTS.find((s) => s.id === proc.classification.primarySegmentId)?.name}
                  </span>
                ) : (
                  <span className="note">not yet processed</span>
                )}
              </td>
              <td>
                {proc ? (
                  <span className={"score " + scoreClass(proc.qualification.relevanceScore)}>
                    {proc.qualification.relevanceScore}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td>
                {proc ? (
                  proc.entity.isNewProspect ? (
                    "New prospect"
                  ) : (
                    <>Matched — {proc.entity.accountName}</>
                  )
                ) : (
                  "—"
                )}
              </td>
              <td>
                {proc ? (
                  <span className={"status-pill status-" + proc.qualification.recommendation}>
                    {proc.qualification.recommendation}
                  </span>
                ) : (
                  "—"
                )}
              </td>
              <td>
                <span className={"status-pill status-" + (proc?.status ?? "pending")}>
                  {proc?.status ?? "pending"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="note">
        Click a row to open the full agent trace for that signal. Relevance = blended score from the
        Classification and Entity Resolution agents (see Agent Console for live processing, or Signal Detail
        for the per-signal breakdown). Target: ≥15% of new pipeline sourced this way within 12 months, ≥30%
        signal-to-qualified-opportunity precision, ≤72h from publication to CRM opportunity.
      </p>
    </div>
  );
}
