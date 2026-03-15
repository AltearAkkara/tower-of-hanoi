import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type Pegs = number[][];

interface GameState {
  diskCount: number;
  minMoves: number;
  initialPeg: number[];
}

export function GamePage() {
  const { state } = useLocation() as { state: GameState };
  const navigate = useNavigate();

  const [pegs, setPegs] = useState<Pegs>([state.initialPeg, [], []]);
  const [selectedPeg, setSelectedPeg] = useState<number | null>(null);
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(true);
  const [won, setWon] = useState(false);

  const { diskCount, minMoves } = state;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const handlePegClick = (pegIndex: number) => {
    if (won) return;

    if (selectedPeg === null) {
      if (pegs[pegIndex].length > 0) {
        setSelectedPeg(pegIndex);
      }
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
      setMoves((m) => m + 1);
      setSelectedPeg(null);

      if (newPegs[2].length === diskCount) {
        setWon(true);
        setRunning(false);
      }
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <main className="container">
      <h1>Hanoi Tower</h1>

      <div className="hud">
        <div className="hud-item">
          <span className="hud-label">Time</span>
          <span className="hud-value">{formatTime(time)}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Moves</span>
          <span className="hud-value">{moves}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Best</span>
          <span className="hud-value">{minMoves}</span>
        </div>
      </div>

      {won && (
        <div className="win-banner">
          Solved!{" "}
          {moves === minMoves ? "Perfect score!" : `${moves - minMoves} extra moves`}
        </div>
      )}

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
                      background: `hsl(${((diskCount - size) / diskCount) * 240}, 70%, 55%)`,
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

      <button className="new-game-btn" onClick={() => navigate("/menu")}>
        New Game
      </button>
    </main>
  );
}
