/// Reads a stages JSON array, removes duplicate puzzles and stages exceeding a
/// move threshold, reassigns sequential stage numbers, and writes to stdout.
///
/// Usage:
///   cargo run --bin dedup_stages <file> [key] [--max-moves N]
///
/// Examples:
///   cargo run --bin dedup_stages classic.stages.json classic --max-moves 400 > out.json
///   cargo run --bin dedup_stages chaos.stages.json   chaos   --max-moves 400 > out.json

use std::collections::HashSet;
use std::io::Read;

fn main() {
    let args: Vec<String> = std::env::args().collect();

    // Parse --max-moves N (anywhere in args after the binary name)
    let max_moves: Option<u64> = args.windows(2).find_map(|w| {
        if w[0] == "--max-moves" { w[1].parse().ok() } else { None }
    });

    // Positional args (skip binary name and --max-moves pair)
    let positional: Vec<&str> = args[1..].iter()
        .filter(|a| *a != "--max-moves")
        .filter(|a| a.parse::<u64>().is_err()) // skip numeric values (the N in --max-moves N)
        .map(|s| s.as_str())
        .collect();

    let file_arg = positional.get(0).copied();
    let key_arg  = positional.get(1).copied();

    // Read input
    let raw = if let Some(path) = file_arg {
        std::fs::read_to_string(path)
            .unwrap_or_else(|e| { eprintln!("Cannot read {path}: {e}"); std::process::exit(1); })
    } else {
        let mut buf = String::new();
        std::io::stdin().read_to_string(&mut buf).expect("Failed to read stdin");
        buf
    };

    let parsed: serde_json::Value =
        serde_json::from_str(&raw).expect("Input must be valid JSON");

    // Accept plain array or object {"classic": [...]} / {"chaos": [...]}
    let mut stages: Vec<serde_json::Value> = if parsed.is_array() {
        parsed.as_array().cloned().unwrap()
    } else if parsed.is_object() {
        let obj = parsed.as_object().unwrap();
        if let Some(k) = key_arg {
            obj.get(k)
                .and_then(|v| v.as_array())
                .cloned()
                .unwrap_or_else(|| { eprintln!("Key '{k}' not found or not an array"); std::process::exit(1); })
        } else {
            obj.values()
                .find_map(|v| v.as_array())
                .cloned()
                .unwrap_or_else(|| { eprintln!("No array found in object"); std::process::exit(1); })
        }
    } else {
        eprintln!("Input must be a JSON array or object");
        std::process::exit(1);
    };

    let total_before = stages.len();
    let mut removed_moves = 0usize;
    let mut removed_dups  = 0usize;

    // 1. Filter by max moves
    if let Some(max) = max_moves {
        stages.retain(|s| {
            let best = s["bestMove"].as_u64().unwrap_or(0);
            if best > max { removed_moves += 1; false } else { true }
        });
    }

    // 2. Remove duplicates by plates fingerprint
    let mut seen: HashSet<String> = HashSet::new();
    stages.retain(|s| {
        let key = s["plates"].to_string();
        if seen.contains(&key) {
            removed_dups += 1;
            false
        } else {
            seen.insert(key);
            true
        }
    });

    // 3. Reassign stage numbers sequentially from 1
    for (i, s) in stages.iter_mut().enumerate() {
        s["stage"] = serde_json::json!(i + 1);
    }

    eprintln!(
        "Before: {total_before}  Removed (>{}moves): {removed_moves}  Removed (dups): {removed_dups}  After: {}",
        max_moves.map(|m| m.to_string()).unwrap_or("∞".into()),
        stages.len()
    );

    println!("{}", serde_json::to_string_pretty(&stages).unwrap());
}
