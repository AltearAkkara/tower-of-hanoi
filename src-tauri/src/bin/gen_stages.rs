use rand::{Rng, SeedableRng};
use rand::rngs::StdRng;
use std::collections::{HashMap, HashSet, VecDeque};

// (difficulty, min_disks, max_disks, min_pegs, max_pegs)
fn stage_difficulty(id: u8) -> (&'static str, u8, u8, u8, u8) {
    match id {
        1..=20  => ("egg",       3, 5,  3, 3),
        21..=45 => ("owlet",     6, 8,  3, 3),
        46..=70 => ("great_owl", 7, 9,  3, 4),
        _       => ("mad_owl",   10, 12, 3, 5),
    }
}

// Frame-Stewart optimal moves for Tower of Hanoi with p pegs, n disks.
// f(n, 3) = 2^n - 1  (proven optimal)
// f(n, p) = min_{k=1..n-1} [ 2*f(k, p) + f(n-k, p-1) ]  (Frame-Stewart conjecture)
fn frame_stewart(n: u32, p: u32, memo: &mut HashMap<(u32, u32), u64>) -> u64 {
    if n == 0 { return 0; }
    if n == 1 { return 1; }
    if p == 3 { return 2u64.pow(n) - 1; }
    if let Some(&cached) = memo.get(&(n, p)) { return cached; }
    let mut best = u64::MAX / 2;
    for k in 1..n {
        let val = 2 * frame_stewart(k, p, memo) + frame_stewart(n - k, p - 1, memo);
        if val < best { best = val; }
    }
    memo.insert((n, p), best);
    best
}

// BFS for min moves with variable number of pegs.
// Uses 3 bits per disk position (supports up to 8 pegs), encoded in u64.
fn bfs_min_moves(plates: &[Vec<u8>], n_pegs: usize) -> u32 {
    let n_disks: usize = plates.iter().map(|p| p.len()).sum();
    if n_disks == 0 { return 0; }

    const BITS: u32 = 3;
    const MASK: u64 = 0b111;

    // Build initial state: for each disk (1..=n), record which peg it's on.
    // Disk index = disk_number - 1 (0-indexed, 0 = smallest).
    let mut initial = vec![0u8; n_disks];
    for (peg_idx, peg) in plates.iter().enumerate() {
        for &disk in peg {
            initial[(disk - 1) as usize] = peg_idx as u8;
        }
    }

    let encode = |state: &[u8]| -> u64 {
        state.iter().enumerate().fold(0u64, |acc, (i, &p)| {
            acc | ((p as u64) << (BITS * i as u32))
        })
    };

    let goal_peg = (n_pegs - 1) as u64;
    let goal: u64 = (0..n_disks as u32).fold(0u64, |acc, i| acc | (goal_peg << (BITS * i)));

    let initial_enc = encode(&initial);
    if initial_enc == goal { return 0; }

    let mut queue: VecDeque<(u64, u32)> = VecDeque::new();
    let mut visited: HashSet<u64> = HashSet::new();
    queue.push_back((initial_enc, 0));
    visited.insert(initial_enc);

    while let Some((enc, moves)) = queue.pop_front() {
        // Find top disk (smallest index = smallest disk = can move) per peg
        let mut tops: Vec<Option<usize>> = vec![None; n_pegs];
        for i in 0..n_disks {
            let peg = ((enc >> (BITS * i as u32)) & MASK) as usize;
            if tops[peg].is_none() {
                tops[peg] = Some(i);
            }
        }
        for from in 0..n_pegs {
            if let Some(disk_idx) = tops[from] {
                for to in 0..n_pegs {
                    if from == to { continue; }
                    // Can place if destination is empty or has a larger disk on top
                    if tops[to].map_or(true, |t| t > disk_idx) {
                        let shift = BITS * disk_idx as u32;
                        let new_enc = (enc & !(MASK << shift)) | ((to as u64) << shift);
                        if new_enc == goal { return moves + 1; }
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

fn classic_stage(stage_id: u8) -> serde_json::Value {
    let (difficulty, min_disks, max_disks, min_pegs, max_pegs) = stage_difficulty(stage_id);
    let mut rng = StdRng::seed_from_u64(stage_id as u64 * 7_919);

    let peg_count: u8 = if min_pegs == max_pegs {
        min_pegs
    } else {
        rng.gen_range(min_pegs..=max_pegs)
    };
    let disk_count: u8 = rng.gen_range(min_disks..=max_disks);

    let mut memo = HashMap::new();
    let best_move = frame_stewart(disk_count as u32, peg_count as u32, &mut memo);

    let mut plates: Vec<Vec<u8>> = vec![Vec::new(); peg_count as usize];
    plates[0] = (1..=disk_count).rev().collect();

    serde_json::json!({
        "stage":     stage_id,
        "difficulty": difficulty,
        "diskCount": disk_count,
        "pegCount":  peg_count,
        "plates":    plates,
        "bestMove":  best_move,
    })
}

fn chaos_stage(stage_id: u8) -> serde_json::Value {
    let (difficulty, min_disks, max_disks, min_pegs, max_pegs) = stage_difficulty(stage_id);
    let mut rng = StdRng::seed_from_u64(stage_id as u64 * 6_271 + 31_337);

    let peg_count: u8 = if min_pegs == max_pegs {
        min_pegs
    } else {
        rng.gen_range(min_pegs..=max_pegs)
    };

    // Cap disk count for higher peg counts to keep BFS state space feasible:
    //   5 pegs → max 10 disks (5^10 ≈ 10M states)
    //   4 pegs → max 12 disks (4^12 ≈ 17M states)
    let effective_max = match peg_count {
        5 => max_disks.min(10),
        4 => max_disks.min(12),
        _ => max_disks,
    };
    let effective_min = min_disks.min(effective_max);
    let disk_count: u8 = rng.gen_range(effective_min..=effective_max);

    let n_source = (peg_count - 1) as usize; // last peg is the goal, rest are source
    let mut plates: Vec<Vec<u8>> = vec![Vec::new(); peg_count as usize];

    // Guarantee each source peg has at least one disk:
    // Assign the n_source largest disks one-per-source-peg, then randomly distribute the rest.
    let disks_desc: Vec<u8> = (1..=disk_count).rev().collect();
    for (i, &disk) in disks_desc.iter().enumerate() {
        if i < n_source {
            plates[i].push(disk);
        } else {
            let target = rng.gen_range(0..n_source);
            plates[target].push(disk);
        }
    }

    let best_move = bfs_min_moves(&plates, peg_count as usize);

    serde_json::json!({
        "stage":     stage_id,
        "difficulty": difficulty,
        "diskCount": disk_count,
        "pegCount":  peg_count,
        "plates":    plates,
        "bestMove":  best_move,
    })
}

fn main() {
    let classic: Vec<serde_json::Value> = (1..=99u8).map(classic_stage).collect();

    eprint!("Generating chaos stages with BFS (may take a moment for hard stages)...\n");
    let chaos: Vec<serde_json::Value> = (1..=99u8)
        .map(|id| {
            let s = chaos_stage(id);
            eprint!("\r  stage {id:2}/99  pegs={}  disks={}  best={}   ",
                s["pegCount"], s["diskCount"], s["bestMove"]);
            s
        })
        .collect();
    eprintln!("\nDone.");

    let output = serde_json::json!({ "classic": classic, "chaos": chaos });
    println!("{}", serde_json::to_string_pretty(&output).unwrap());
}
