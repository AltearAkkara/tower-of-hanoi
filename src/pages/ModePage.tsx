import { useNavigate } from "react-router-dom";

const MODES = [
  {
    key: "classic",
    label: "Classic",
    description: "3 pegs, move all disks to the last peg",
  },
] as const;

export function ModePage() {
  const navigate = useNavigate();

  return (
    <main className="container">
      <h2 className="page-heading">Select Mode</h2>
      <div className="mode-list">
        {MODES.map(({ key, label, description }) => (
          <button
            key={key}
            className="mode-card"
            onClick={() => navigate("/difficulty", { state: { mode: key } })}
          >
            <span className="mode-label">{label}</span>
            <span className="mode-desc">{description}</span>
          </button>
        ))}
      </div>
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </main>
  );
}
