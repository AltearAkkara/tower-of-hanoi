import { load } from "@tauri-apps/plugin-store";

const STORE_FILE = "leaderboard.json";

export interface ScoreEntry {
  mode: string;
  difficulty: string;
  stageId: number;
  moves: number;
  time: number;       // seconds
  minMoves: number;
  timestamp: string;  // ISO timestamp
}

export interface SaveResult {
  saved: boolean;
  movesImproved: boolean;
  timeImproved: boolean;
  isFirstClear: boolean;
}

async function getStore() {
  return await load(STORE_FILE);
}

/** Returns the best score per stageId for a given mode. */
export async function getBestByStage(mode: string): Promise<Record<number, ScoreEntry>> {
  const store = await getStore();
  const entries: ScoreEntry[] = (await store.get<ScoreEntry[]>("scores")) ?? [];
  const best: Record<number, ScoreEntry> = {};
  for (const entry of entries) {
    if (entry.mode !== mode) continue;
    const cur = best[entry.stageId];
    if (!cur || entry.moves < cur.moves || (entry.moves === cur.moves && entry.time < cur.time)) {
      best[entry.stageId] = entry;
    }
  }
  return best;
}

/**
 * Auto-save logic:
 * - Always saves if never played before
 * - Saves if moves improved (fewer is better)
 * - Saves if same moves but time improved
 * - Returns what improved (if anything)
 */
export async function tryAutoSave(entry: ScoreEntry): Promise<SaveResult> {
  const store = await getStore();
  const entries: ScoreEntry[] = (await store.get<ScoreEntry[]>("scores")) ?? [];

  const existing = entries
    .filter(e => e.mode === entry.mode && e.stageId === entry.stageId)
    .sort((a, b) => a.moves !== b.moves ? a.moves - b.moves : a.time - b.time)[0];

  if (!existing) {
    entries.push(entry);
    await store.set("scores", entries);
    await store.save();
    return { saved: true, movesImproved: false, timeImproved: false, isFirstClear: true };
  }

  const movesImproved = entry.moves < existing.moves;
  const timeImproved = entry.moves === existing.moves && entry.time < existing.time;

  if (movesImproved || timeImproved) {
    entries.push(entry);
    await store.set("scores", entries);
    await store.save();
    return { saved: true, movesImproved, timeImproved, isFirstClear: false };
  }

  return { saved: false, movesImproved: false, timeImproved: false, isFirstClear: false };
}

export async function clearAllScores(): Promise<void> {
  const store = await getStore();
  await store.set("scores", []);
  await store.save();
}
