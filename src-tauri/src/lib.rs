use std::collections::{HashSet, VecDeque};

const STAGES_JSON: &str = include_str!("../stages.json");

fn get_stages_data() -> serde_json::Value {
    serde_json::from_str(STAGES_JSON).expect("stages.json must be valid JSON")
}

/// BFS to find the minimum number of moves from an arbitrary peg state to goal (all on peg 2).
fn bfs_min_moves(pegs: &[Vec<u8>]) -> u32 {
    let n: usize = pegs.iter().map(|p| p.len()).sum();
    if n == 0 {
        return 0;
    }

    let encode = |state: &[u8]| -> u32 {
        state
            .iter()
            .enumerate()
            .fold(0u32, |acc, (i, &p)| acc | ((p as u32) << (2 * i as u32)))
    };

    let mut initial = vec![0u8; n];
    for (peg_idx, peg) in pegs.iter().enumerate() {
        for &disk in peg {
            initial[(disk - 1) as usize] = peg_idx as u8;
        }
    }

    let goal: u32 = (0..n as u32).fold(0u32, |acc, i| acc | (2u32 << (2 * i)));
    let initial_enc = encode(&initial);
    if initial_enc == goal {
        return 0;
    }

    let mut queue: VecDeque<(u32, u32)> = VecDeque::new();
    let mut visited: HashSet<u32> = HashSet::new();
    queue.push_back((initial_enc, 0));
    visited.insert(initial_enc);

    while let Some((enc, moves)) = queue.pop_front() {
        let mut tops: [Option<usize>; 3] = [None; 3];
        for i in 0..n {
            let peg = ((enc >> (2 * i as u32)) & 3) as usize;
            if tops[peg].is_none() {
                tops[peg] = Some(i);
            }
        }
        for from in 0..3usize {
            if let Some(disk_idx) = tops[from] {
                for to in 0..3usize {
                    if from == to {
                        continue;
                    }
                    if tops[to].map_or(true, |t| t > disk_idx) {
                        let shift = (2 * disk_idx) as u32;
                        let new_enc = (enc & !(3u32 << shift)) | ((to as u32) << shift);
                        if new_enc == goal {
                            return moves + 1;
                        }
                        if visited.insert(new_enc) {
                            queue.push_back((new_enc, moves + 1));
                        }
                    }
                }
            }
        }
    }
    0
}

// ── Stage commands ─────────────────────────────────────────────────────────

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct StageInfo {
    id: u8,
    difficulty: String,
    best_move: u32,
    peg_count: u8,
}

/// Returns the list of all stages with their difficulty labels and optimal move counts.
#[tauri::command]
fn get_stages(mode: String) -> Vec<StageInfo> {
    let data = get_stages_data();
    let stages = data[mode.as_str()].as_array().cloned().unwrap_or_default();
    stages
        .into_iter()
        .filter_map(|s| {
            let id = s["stage"].as_u64()? as u8;
            let difficulty = s["difficulty"].as_str()?.to_string();
            let best_move = s["bestMove"].as_u64()? as u32;
            let peg_count = s["pegCount"].as_u64()? as u8;
            Some(StageInfo { id, difficulty, best_move, peg_count })
        })
        .collect()
}

/// Returns the full configuration for a stage so the frontend can start the game.
#[tauri::command]
fn start_stage(mode: String, stage_id: u8) -> serde_json::Value {
    let data = get_stages_data();
    let stages = data[mode.as_str()].as_array().cloned().unwrap_or_default();
    if let Some(stage) = stages.iter().find(|s| s["stage"].as_u64() == Some(stage_id as u64)) {
        serde_json::json!({
            "diskCount":   stage["diskCount"],
            "minMoves":    stage["bestMove"],
            "initialPegs": stage["plates"],
            "pegCount":    stage["pegCount"],
        })
    } else {
        serde_json::json!({})
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_store::Builder::default().build())
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_stages,
            start_stage,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
