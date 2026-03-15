import { useNavigate } from "react-router-dom";

export function LeaderboardPage() {
  const navigate = useNavigate();

  return (
    <main className="container">
      <h2 className="page-heading">Leaderboard</h2>
      <p className="page-empty">Coming soon</p>
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </main>
  );
}
