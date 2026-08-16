import { useEffect, useRef, useState } from "react";
import { useAppStore } from "../store/useAppStore";
import { SOURCE_REGISTRY } from "../data/taxonomy";
import { fmtTime } from "../lib/format";
import type { RawSignal } from "../data/signals";
import "./pages.css";

let customSignalCounter = 1000;

export default function AgentConsole() {
  const { logs, isRunning, runAll, clearLogs, ingestCustomSignal, rawQueue, processed } = useAppStore();
  const logRef = useRef<HTMLDivElement>(null);

  const [titleEn, setTitleEn] = useState("");
  const [titleCn, setTitleCn] = useState("");
  const [body, setBody] = useState("");
  const [sourceId, setSourceId] = useState(SOURCE_REGISTRY[0].id);
  const [estValue, setEstValue] = useState(2000000);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [logs]);

  const pendingCount = rawQueue.length - Object.keys(processed).length;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!titleEn.trim() || !body.trim()) return;
    customSignalCounter += 1;
    const signal: RawSignal = {
      id: `SIG-C${customSignalCounter}`,
      sourceId,
      title: titleEn.trim(),
      titleCn: titleCn.trim() || titleEn.trim(),
      body: body.trim(),
      publishedAt: new Date().toISOString().slice(0, 10),
      estValueSEK: estValue,
    };
    setSubmitting(true);
    await ingestCustomSignal(signal);
    setSubmitting(false);
    setTitleEn("");
    setTitleCn("");
    setBody("");
  }

  return (
    <div>
      <div className="panel-toolbar">
        <h2>Agent Console</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn" onClick={clearLogs} disabled={logs.length === 0}>
            Clear log
          </button>
          <button className="btn primary" onClick={() => runAll()} disabled={isRunning || pendingCount <= 0}>
            {isRunning ? "Running…" : `Run pipeline (${Math.max(pendingCount, 0)} pending)`}
          </button>
        </div>
      </div>

      <div className="console-grid">
        <div>
          <div className="console-log" ref={logRef}>
            {logs.length === 0 && (
              <div className="console-empty">
                No agent activity yet. Run the pipeline from the Weekly Digest, submit a signal below, or click
                "Run pipeline" above.
              </div>
            )}
            {logs.map((log) => (
              <div className="log-line" key={log.id}>
                <span className="log-time">{fmtTime(log.ts)}</span>
                <span className={"log-agent " + log.level}>[{log.agent}]</span>
                <span>{log.message}</span>
              </div>
            ))}
          </div>
          <p className="note">
            Four agents run in sequence, client-side, over each signal's own text — no external model calls.
            Ingestion normalizes bilingual text; Classification does term-frequency scoring against the
            segment keyword taxonomy; Entity Resolution fuzzy-matches account names via bigram similarity;
            Qualification blends both into a relevance score and routing recommendation.
          </p>
        </div>

        <form className="ingest-form" onSubmit={handleSubmit}>
          <h3>Submit a new signal for live processing</h3>
          <label htmlFor="src">Source</label>
          <select id="src" value={sourceId} onChange={(e) => setSourceId(e.target.value)}>
            {SOURCE_REGISTRY.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>

          <label htmlFor="titleEn">Title (English)</label>
          <input
            id="titleEn"
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            placeholder="e.g. Hubei robotics capacity-expansion filing"
          />

          <label htmlFor="titleCn">Title (Chinese, optional)</label>
          <input
            id="titleCn"
            value={titleCn}
            onChange={(e) => setTitleCn(e.target.value)}
            placeholder="例如：湖北机器人产能扩张备案"
          />

          <label htmlFor="body">Body text (bilingual — this is what the agents actually read)</label>
          <textarea
            id="body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste or write the raw signal text here, mixing English and Chinese as it would arrive from a monitored source…"
          />

          <label htmlFor="value">Estimated deal value (SEK)</label>
          <input
            id="value"
            type="number"
            min={0}
            step={100000}
            value={estValue}
            onChange={(e) => setEstValue(Number(e.target.value))}
          />

          <div className="form-actions">
            <button className="btn primary" type="submit" disabled={submitting || !titleEn.trim() || !body.trim()}>
              {submitting ? "Processing…" : "Ingest & run agents"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
