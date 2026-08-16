interface KpiProps {
  num: string;
  label: string;
  target: string;
}

export function KpiRow({ items }: { items: KpiProps[] }) {
  return (
    <div className="kpi-row">
      {items.map((k) => (
        <div className="kpi-card" key={k.label}>
          <div className="kpi-num">{k.num}</div>
          <div className="kpi-label">{k.label}</div>
          <div className="kpi-target">{k.target}</div>
        </div>
      ))}
    </div>
  );
}
