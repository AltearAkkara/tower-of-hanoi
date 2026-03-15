import { useNavigate } from "react-router-dom";

export function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="container home-container">
      <div className="home-title-block">
        <h1 className="home-title">Hanoi Tower</h1>
        <p className="home-subtitle">Move all disks to the last peg</p>
      </div>
      <div className="home-buttons">
        <button className="home-btn home-btn-primary" onClick={() => navigate("/mode")}>
          Start Game
        </button>
        <button className="home-btn" onClick={() => navigate("/leaderboard")}>
          Leaderboard
        </button>
        <button className="home-btn" onClick={() => navigate("/settings")}>
          Settings
        </button>
      </div>
    </main>
  );
}
