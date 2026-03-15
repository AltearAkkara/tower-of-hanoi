use rand::Rng;

#[tauri::command]
fn generate_level(difficulty: String) -> u8 {
    let mut rng = rand::thread_rng();
    match difficulty.as_str() {
        "duck" => rng.gen_range(3..=4),
        "pigeon" => rng.gen_range(5..=6),
        "eagle" => rng.gen_range(7..=8),
        "owl" => rng.gen_range(9..=10),
        _ => 3,
    }
}

#[tauri::command]
fn get_min_moves(disk_count: u8) -> u32 {
    2u32.pow(disk_count as u32) - 1
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
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
        .invoke_handler(tauri::generate_handler![generate_level, get_min_moves])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
