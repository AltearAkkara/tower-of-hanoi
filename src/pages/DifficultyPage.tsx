import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useSettings } from "../context/SettingsContext";
import type { Translations } from "../i18n/translations";

type DifficultyKey = "duck" | "pigeon" | "eagle" | "owl";

const DIFFICULTIES: { key: DifficultyKey; labelKey: keyof Translations; range: string; emoji: string }[] = [
  { key: "duck",   labelKey: "difficultyEgg",      range: "3–4 disks",  emoji: "🥚" },
  { key: "pigeon", labelKey: "difficultyOwlet",    range: "5–6 disks",  emoji: "🦉" },
  { key: "eagle",  labelKey: "difficultyGreatOwl", range: "7–8 disks",  emoji: "🦉" },
  { key: "owl",    labelKey: "difficultyMadOwl",   range: "9–10 disks", emoji: "🦉" },
];

interface ScrambledResult {
  diskCount: number;
  peg0: number[];
  peg1: number[];
}

export function DifficultyPage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { mode: string } };
  const { t } = useSettings();
  const mode = state?.mode ?? "classic";

  const startGame = useCallback(async (difficulty: DifficultyKey) => {
    let initialPegs: number[][];
    let diskCount: number;
    let minMoves: number;

    if (mode === "chaos") {
      const result = await invoke<ScrambledResult>("generate_scrambled", { difficulty });
      diskCount = result.diskCount;
      initialPegs = [result.peg0, result.peg1, []];
      minMoves = await invoke<number>("get_min_moves_scrambled", { pegs: initialPegs });
    } else {
      diskCount = await invoke<number>("generate_level", { difficulty });
      minMoves = await invoke<number>("get_min_moves", { diskCount });
      const peg0 = Array.from({ length: diskCount }, (_, i) => diskCount - i);
      initialPegs = [peg0, [], []];
    }

    navigate("/game", { state: { diskCount, minMoves, initialPegs, difficulty, mode } });
  }, [navigate, mode]);

  return (
    <main className="container">
      <h2 className="page-heading">{t.selectDifficulty}</h2>
      <div className="difficulty-list">
        {DIFFICULTIES.map(({ key, labelKey, range, emoji }) => (
          <button
            key={key}
            className="difficulty-card"
            onClick={() => startGame(key)}
          >
            <span className="difficulty-emoji">{emoji}</span>
            <span className="difficulty-label">{t[labelKey] as string}</span>
            <span className="difficulty-range">{range}</span>
          </button>
        ))}
      </div>
      <button className="back-btn" onClick={() => navigate("/mode")}>
        {t.back}
      </button>
    </main>
  );
}
