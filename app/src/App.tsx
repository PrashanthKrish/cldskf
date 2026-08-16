import { NavLink, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import AgentConsole from "./pages/AgentConsole";
import SignalDetail from "./pages/SignalDetail";
import Pipeline from "./pages/Pipeline";
import Sources from "./pages/Sources";
import "./App.css";

const NAV_ITEMS = [
  { to: "/", label: "Weekly Digest", end: true },
  { to: "/console", label: "Agent Console" },
  { to: "/pipeline", label: "Routed Pipeline" },
  { to: "/sources", label: "Sources" },
];

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <div className="logo">SKF</div>
          <div>
            <h1>Demand Signal Radar</h1>
            <p>CNEA · Commercial AI Growth Programme</p>
          </div>
        </div>
        <div className="lever-tag">Lever A · Sales Growth — A2</div>
      </header>

      <nav className="app-nav">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <main className="app-main">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/console" element={<AgentConsole />} />
          <Route path="/signal/:id" element={<SignalDetail />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/sources" element={<Sources />} />
        </Routes>
      </main>

      <footer className="app-footer">
        Illustrative prototype for the SKF China CNEA AI Growth Levers programme — Lever A, Challenge
        A2. Synthetic data only. Agent pipeline runs entirely client-side, no external integrations.
      </footer>
    </div>
  );
}

export default App;
