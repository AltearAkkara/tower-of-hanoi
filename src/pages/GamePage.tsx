import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";
import { useSettings } from "../context/SettingsContext";
import { tryAutoSave, type SaveResult } from "../services/leaderboard";

type Pegs = number[][];

interface GameState {
  diskCount: number;
  minMoves: number;
  initialPegs: number[][];
  difficulty: string;
  mode: string;
  stageId: number;
  pegCount: number;
}

interface StageConfig {
  diskCount: number;
  minMoves: number;
  initialPegs: number[][];
  pegCount: number;
}

export function GamePage() {
  const { state } = useLocation() as { state: GameState };
  const navigate = useNavigate();
  const { t, theme } = useSettings();

  const [pegs, setPegs] = useState<Pegs>(state.initialPegs);
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);
  const [won, setWon] = useState(false);
  const [diskCount, setDiskCount] = useState(state.diskCount);
  const [minMoves, setMinMoves] = useState(state.minMoves);
  const [pegCount, setPegCount] = useState(state.pegCount);
  const [saveResult, setSaveResult] = useState<SaveResult | null>(null);
  const winSnapshot = useRef<{ moves: number; time: number } | null>(null);

  const { difficulty, mode, stageId } = state;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  // Auto-save immediately when the game is won
  useEffect(() => {
    const snap = winSnapshot.current;
    if (!won || !snap) return;
    tryAutoSave({
      mode,
      difficulty,
      stageId,
      moves: snap.moves,
      time: snap.time,
      minMoves,
      timestamp: new Date().toISOString(),
    }).then(setSaveResult).catch(console.error);
  }, [won]);

  const resetGame = useCallback(async () => {
    const config = await invoke<StageConfig>("start_stage", { mode, stageId });
    setDiskCount(config.diskCount);
    setMinMoves(config.minMoves);
    setPegCount(config.pegCount);
    setPegs(config.initialPegs);
    setSelectedPeg(null);
    setMoves(0);
    setTime(0);
    setRunning(true);
    setWon(false);
    setSaveResult(null);
    winSnapshot.current = null;
  }, [mode, stageId]);

  const handlePegClick = (pegIndex: number) => {
    if (won) return;

    if (selectedPeg === null) {
      if (pegs[pegIndex].length > 0) setSelectedPeg(pegIndex);
    } else {
      if (selectedPeg === pegIndex) {
        setSelectedPeg(null);
        return;
      }

      const fromPeg = pegs[selectedPeg];
      const toPeg = pegs[pegIndex];
      const movingDisk = fromPeg[fromPeg.length - 1];

      if (toPeg.length > 0 && toPeg[toPeg.length - 1] < movingDisk) {
        setSelectedPeg(null);
        return;
      }

      const newPegs: Pegs = pegs.map((p) => [...p]);
      newPegs[pegIndex].push(newPegs[selectedPeg].pop()!);
      setPegs(newPegs);
      const newMoves = moves + 1;
      setMoves(newMoves);
      setSelectedPeg(null);

      if (newPegs[pegCount - 1].length === diskCount) {
        setWon(true);
        setRunning(false);
        winSnapshot.current = { moves: newMoves, time };
      }
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const modeLabel = mode === "classic" ? t.modeClassicLabel : t.modeChaosLabel;
  const snap = winSnapshot.current;

  return (
    <main className="container">
      <h1>{modeLabel} — {t.stage} {stageId}</h1>

      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">{t.time}</span>
          <span className="hud-value">{formatTime(time)}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">{t.moves}</span>
          <span className="hud-value">{moves}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">{t.best}</span>
          <span className="hud-value">{minMoves}</span>
        </div>
      </div>

      <div className="board">
        {pegs.map((peg, pi) => (
          <div
            key={pi}
            className={`peg-container${selectedPeg === pi ? " selected" : ""}`}
            onClick={() => handlePegClick(pi)}
          >
            <div className="peg-area">
              <div className="peg-pole" />
              <div className="disks">
                {peg.map((size, di) => (
                  <div
                    key={di}
                    className={`disk${di === peg.length - 1 && selectedPeg === pi ? " disk-top" : ""}`}
                    style={{
                      width: `${(size / diskCount) * 80 + 10}%`,
                      background: `hsl(${((diskCount - size) / diskCount) * theme.diskHueRange}, 70%, 55%)`,
                    }}
                  >
                    {size}
                  </div>
                ))}
              </div>
            </div>
            <div className="peg-base" />
            <div className="peg-label">{["A", "B", "C"][pi]}</div>
          </div>
        ))}
      </div>

      <div className="game-actions">
        <button className="new-game-btn" onClick={resetGame}>
          {t.newGame}
        </button>
        <button className="back-btn" onClick={() => navigate("/difficulty", { state: { mode } })}>
          {t.exitLevel}
        </button>
      </div>

      {won && snap && (
        <div className="win-overlay">
          <div className="win-dialog">
            <div className="win-dialog-icon">🎉</div>
            <h2 className="win-dialog-title">{t.congratulations}</h2>
            <p className="win-dialog-score">
              {snap.moves === minMoves ? t.perfectScore : t.formatExtraMoves(snap.moves - minMoves)}
            </p>

            {saveResult?.movesImproved && (
              <p className="win-improved win-improved-moves">{t.movesImproved}</p>
            )}
            {saveResult?.timeImproved && (
              <p className="win-improved win-improved-time">{t.timeImproved}</p>
            )}

            <div className="win-dialog-stats">
              <div className="win-stat">
                <span className="win-stat-label">{t.moves}</span>
                <span className="win-stat-value">{snap.moves}</span>
              </div>
              <div className="win-stat">
                <span className="win-stat-label">{t.best}</span>
                <span className="win-stat-value">{minMoves}</span>
              </div>
              <div className="win-stat">
                <span className="win-stat-label">{t.time}</span>
                <span className="win-stat-value">{formatTime(snap.time)}</span>
              </div>
            </div>

            <div className="win-dialog-actions">
              <button className="win-btn-primary" onClick={resetGame}>
                {t.playAgain}
              </button>
              <button className="win-btn-secondary" onClick={() => navigate("/difficulty", { state: { mode } })}>
                {t.goToStages}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
