import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useSettings } from "../context/SettingsContext";
import { getBestByStage } from "../services/leaderboard";
import type { ScoreEntry } from "../services/leaderboard";

interface StageInfo {
  id: number;
  difficulty: "egg" | "owlet" | "great_owl" | "mad_owl";
  bestMove: number;
  pegCount: number;
}

interface StageConfig {
  diskCount: number;
  minMoves: number;
  initialPegs: number[][];
}

const DIFFICULTY_EMOJI: Record<string, string> = {
  egg:       "🥚",
  owlet:     "🐣",
  great_owl: "🦉",
  mad_owl:   "🦉",
};

const DIFFICULTY_LABEL_KEY = {
  egg:       "difficultyEgg",
  owlet:     "difficultyOwlet",
  great_owl: "difficultyGreatOwl",
  mad_owl:   "difficultyMadOwl",
} as const;

const DIFFICULTY_BG: Record<string, string> = {
  egg:       "rgba(100,108,255,0.15)",
  owlet:     "rgba(0,200,120,0.15)",
  great_owl: "rgba(255,180,0,0.15)",
  mad_owl:   "rgba(220,60,60,0.15)",
};

function fmtTime(s: number) {
  return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

function fmtDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
}

export function StagePage() {
  const navigate = useNavigate();
  const { state } = useLocation() as { state: { mode: string } };
  const { t } = useSettings();
  const mode = state?.mode ?? "classic";

  const [stages, setStages] = useState<StageInfo[]>([]);
  const [best, setBest] = useState<Record<number, ScoreEntry>>({});
  const [loading, setLoading] = useState<number | null>(null);

  useEffect(() => {
    invoke<StageInfo[]>("get_stages", { mode }).then(setStages);
    getBestByStage(mode).then(setBest);
  }, [mode]);

  const selectStage = useCallback(async (stage: StageInfo) => {
    setLoading(stage.id);
    try {
      const config = await invoke<StageConfig>("start_stage", { mode, stageId: stage.id });
      navigate("/game", {
        state: { ...config, difficulty: stage.difficulty, mode, stageId: stage.id },
      });
    } finally {
      setLoading(null);
    }
  }, [navigate, mode]);

  return (
    <main className="container">
      <h2 className="page-heading">{t.selectStage}</h2>

      <div className="stage-grid">
        {stages.map((stage) => {
          const { id, difficulty, bestMove, pegCount } = stage;
          const score = best[id];
          const labelKey = DIFFICULTY_LABEL_KEY[difficulty];
          const diffLabel = labelKey ? t[labelKey] : difficulty;

          const perfect = !!score && score.moves === bestMove;
          const played = !!score && !perfect;

          let cardBg = DIFFICULTY_BG[difficulty];
          if (perfect) cardBg = "rgba(0,200,100,0.15)";
          else if (played) cardBg = "rgba(255,200,0,0.10)";

          return (
            <button
              key={id}
              className={`stage-card${perfect ? " stage-perfect" : played ? " stage-played" : ""}`}
              style={{ background: cardBg }}
              onClick={() => selectStage(stage)}
              disabled={loading !== null}
            >
              {/* Header: stage number + status */}
              <div className="stage-card-header">
                <span className="stage-num">{loading === id ? "…" : id}</span>
                <span className="stage-status">{perfect ? t.stagePerfect : played ? t.stageTryHarder : ""}</span>
              </div>

              {/* Difficulty + pegs */}
              <div className="stage-card-diff">
                <span>{DIFFICULTY_EMOJI[difficulty]} {diffLabel}</span>
                <span className="stage-pegs">{pegCount}P</span>
              </div>

              {/* Score rows */}
              {score ? (
                <div className="stage-card-stats">
                  <div className="stage-stat-row">
                    <span className="stage-stat-label">Moves</span>
                    <span className="stage-stat-val">
                      {score.moves}<span className="stage-stat-opt">/{bestMove}</span>
                    </span>
                  </div>
                  <div className="stage-stat-row">
                    <span className="stage-stat-label">Time</span>
                    <span className="stage-stat-val">{fmtTime(score.time)}</span>
                  </div>
                  <div className="stage-stat-row">
                    <span className="stage-stat-label">Date</span>
                    <span className="stage-stat-val stage-stat-date">{fmtDate(score.timestamp)}</span>
                  </div>
                </div>
              ) : (
                <div className="stage-card-stats stage-unplayed">
                  <div className="stage-stat-row">
                    <span className="stage-stat-label">Opt</span>
                    <span className="stage-stat-val">{bestMove}</span>
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <button className="back-btn" onClick={() => navigate("/mode")}>
        {t.back}
      </button>
    </main>
  );
}
