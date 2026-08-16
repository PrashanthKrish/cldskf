import { useAppStore } from "../store/useAppStore";
import { SEGMENTS, SOURCE_REGISTRY } from "../data/taxonomy";
import { fmtDate, fmtSEK } from "../lib/format";
import "./pages.css";

export default function Pipeline() {
  const opportunities = useAppStore((s) => s.opportunities);
  const totalValue = opportunities.reduce((sum, o) => sum + o.estValueSEK, 0);

  return (
    <div>
      <div className="panel-toolbar">
        <h2>Routed Pipeline</h2>
        <span className="note" style={{ margin: 0 }}>
          {opportunities.length} opportunit{opportunities.length === 1 ? "y" : "ies"} · {fmtSEK(totalValue)}{" "}
          total estimated value
        </span>
      </div>

      {opportunities.length === 0 ? (
        <div className="empty-state">
          No opportunities routed yet. Process signals in the Weekly Digest or Agent Console, then accept one
          from its detail page.
        </div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Opportunity</th>
              <th>Segment</th>
              <th>Owner</th>
              <th>Est. Value</th>
              <th>Source</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {opportunities.map((o) => (
              <tr key={o.signalId + o.createdAt} style={{ cursor: "default" }}>
                <td>
                  <strong>{o.title}</strong>
                  <div className="note" style={{ marginTop: 3 }}>{o.signalId}</div>
                </td>
                <td>{SEGMENTS.find((s) => s.id === o.segmentId)?.name}</td>
                <td>{o.owner}</td>
                <td>{fmtSEK(o.estValueSEK)}</td>
                <td>{SOURCE_REGISTRY.find((s) => s.id === o.sourceId)?.name}</td>
                <td>{fmtDate(o.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
