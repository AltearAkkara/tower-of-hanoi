# Tower of Hanoi

I ran out of free Tower of Hanoi games to play. The easy ones got boring, the harder ones wanted my money. So I just built my own.

That's it. That's the whole origin story.

## What it is

A Tower of Hanoi desktop app with a stage system, multiple modes, and best-score tracking — so you know exactly how badly you're doing.

## Stack

- **Tauri v2** — desktop shell
- **React 19** + **TypeScript** — UI
- **Rust** — game logic, BFS optimal-move calculation, stage generation

None of this was chosen for being optimal. The whole point was to learn these tools by building something I'd actually use.

## Modes

| Mode | Status | Description |
|------|--------|-------------|
| The Owl and Classic world | Playable | All disks start on the first peg. Move them all to the last. |
| The Owl and Chaos world | Playable | Disks start scrambled across pegs. Still gotta move them all to the last. |
| The Owl and Forbidden world | Coming soon | — |
| The Owl and Forgotten world | Coming soon | — |

## Difficulty

| Level | Disks | Pegs |
|-------|-------|------|
| 🥚 Egg | 3–5 | 3 |
| 🦉 Owlet | 6–8 | 3 |
| 🦉 Great Owl | 7–9 | 3–4 |
| 🦉 Mad Owl | 10–12 | 3–5 |

Classic mode has 10 stages (4 per difficulty). Chaos mode has up to 75 stages.

Optimal move counts are pre-computed: Frame-Stewart formula for classic, BFS for chaos. All stages are seeded and fixed — everyone plays the same puzzles.

## Features

- Stage select with best-score display (moves, time, date)
- Auto-saves only if you actually improve (fewer moves, or same moves with less time)
- Perfect clear indicator (✓) vs. cleared but not optimal (−)
- Language toggle: EN / TH
- 4 color themes

## Running locally

```bash
yarn install
yarn tauri dev
```

Requires [Rust](https://rustup.rs) and the [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS.

## Regenerating stage files

```bash
cd src-tauri
cargo run --bin gen_stages classic > classic.stages.json
cargo run --bin gen_stages chaos   > chaos.stages.json

# Optional: deduplicate and filter by max moves
cargo run --bin dedup_stages classic.stages.json classic --max-moves 400 > classic.deduped.json
cargo run --bin dedup_stages chaos.stages.json   chaos   --max-moves 400 > chaos.deduped.json
```
