import { useAppStore } from "../store/useAppStore";
import "./pages.css";

export default function Sources() {
  const { sources, toggleSource } = useAppStore();
  const enabledCount = sources.filter((s) => s.enabled).length;

  return (
    <div>
      <div className="panel-toolbar">
        <h2>Sources Monitored</h2>
        <span className="note" style={{ margin: 0 }}>
          {enabledCount}/{sources.length} active
        </span>
      </div>
      <div className="src-list">
        {sources.map((s) => (
          <div className="src-card" key={s.id}>
            <div>
              <h4>{s.name}</h4>
              <p>{s.description}</p>
              <div className="cn">{s.nameCn}</div>
              <div className="cadence">Cadence: {s.cadence}</div>
            </div>
            <button
              className={"toggle " + (s.enabled ? "on" : "")}
              onClick={() => toggleSource(s.id)}
              aria-label={`Toggle ${s.name}`}
            />
          </div>
        ))}
      </div>
      <p className="note">
        Disabling a source excludes it from future ingestion batches (illustrative — the seeded digest is
        unaffected). Target: 100% of named priority segments monitored across at least one active source.
      </p>
    </div>
  );
}
