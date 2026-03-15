import { useNavigate } from "react-router-dom";

export function SettingsPage() {
  const navigate = useNavigate();

  return (
    <main className="container">
      <h2 className="page-heading">Settings</h2>
      <p className="page-empty">Coming soon</p>
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </main>
  );
}
