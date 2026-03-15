# Tower of Hanoi

I ran out of free Tower of Hanoi games to play. The easy ones got boring, the harder ones wanted my money. So I just built my own.

That's it. That's the whole origin story.

## What it is

A Hanoi Tower desktop app with difficulty levels that actually scale — from 3 disks (Duck) up to 10 disks (Owl). Tracks your move count, time, and minimum possible moves so you know exactly how badly you're doing.

## Stack

- **Tauri v2** — desktop shell
- **React 19** + **TypeScript** — UI
- **Rust** — game logic, level generation

None of this was chosen for being optimal. The whole point was to learn these tools by building something I'd actually use.

## Difficulty

| Level | Disks | Minimum moves |
|-------|-------|---------------|
| 🦆 Duck | 3–4 | 7–15 |
| 🐦 Pigeon | 5–6 | 31–63 |
| 🦅 Eagle | 7–8 | 127–255 |
| 🦉 Owl | 9–10 | 511–1023 |

## Running locally

```bash
yarn install
yarn tauri dev
```

Requires [Rust](https://rustup.rs) and the [Tauri prerequisites](https://tauri.app/start/prerequisites/) for your OS.

## Status

Work in progress. Classic mode is playable. Harder mechanics (restricted moves, multi-peg, random start states) are planned.
