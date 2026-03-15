import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

const DIFFICULTIES = [
  { key: "duck", label: "Duck", range: "3–4 disks", emoji: "🦆" },
  { key: "pigeon", label: "Pigeon", range: "5–6 disks", emoji: "🐦" },
  { key: "eagle", label: "Eagle", range: "7–8 disks", emoji: "🦅" },
  { key: "owl", label: "Owl", range: "9–10 disks", emoji: "🦉" },
] as const;

export function DifficultyPage() {
  const navigate = useNavigate();

  const startGame = useCallback(async (difficulty: string) => {
    const diskCount = await invoke<number>("generate_level", { difficulty });
    const minMoves = await invoke<number>("get_min_moves", { diskCount });
    const initialPeg = Array.from({ length: diskCount }, (_, i) => diskCount - i);
    navigate("/game", { state: { diskCount, minMoves, initialPeg } });
  }, [navigate]);

  return (
    <main className="container">
      <h2 className="page-heading">Select Difficulty</h2>
      <div className="difficulty-list">
        {DIFFICULTIES.map(({ key, label, range, emoji }) => (
          <button
            key={key}
            className="difficulty-card"
            onClick={() => startGame(key)}
          >
            <span className="difficulty-emoji">{emoji}</span>
            <span className="difficulty-label">{label}</span>
            <span className="difficulty-range">{range}</span>
          </button>
        ))}
      </div>
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
    </main>
  );
}
