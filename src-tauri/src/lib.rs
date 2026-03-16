const CLASSIC_STAGES_JSON: &str = include_str!("../classic.stages.json");
const CHAOS_STAGES_JSON: &str = include_str!("../chaos.stages.json");

fn get_stages_data(mode: &str) -> Vec<serde_json::Value> {
    let json = match mode {
        "classic" => CLASSIC_STAGES_JSON,
        "chaos"   => CHAOS_STAGES_JSON,
        _         => return vec![],
    };
    let parsed: serde_json::Value =
        serde_json::from_str(json).expect("stages JSON must be valid");
    if let Some(arr) = parsed.as_array() {
        arr.clone()
    } else if let Some(arr) = parsed.get(mode).and_then(|v| v.as_array()) {
        arr.clone()
    } else {
        vec![]
    }
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
    get_stages_data(&mode)
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
    let stages = get_stages_data(&mode);
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
