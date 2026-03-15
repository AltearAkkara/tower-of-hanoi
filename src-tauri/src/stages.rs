use rand::{Rng, SeedableRng};
use rand::rngs::StdRng;

pub const TOTAL_STAGES: u8 = 99;

/// Returns ("difficulty_key", min_disks, max_disks) for a given stage id (1-99)
pub fn stage_difficulty(id: u8) -> (&'static str, u8, u8) {
    match id {
        1..=20  => ("egg",       3, 4),
        21..=45 => ("owlet",     5, 6),
        46..=70 => ("great_owl", 7, 8),
        _       => ("mad_owl",   9, 10),
    }
}

/// Deterministic classic stage: returns (disk_count)
/// Same stage id always produces same disk count.
pub fn classic_stage(stage_id: u8) -> u8 {
    let (_, min_disks, max_disks) = stage_difficulty(stage_id);
    if min_disks == max_disks {
        return min_disks;
    }
    let mut rng = StdRng::seed_from_u64(stage_id as u64 * 7_919);
    rng.gen_range(min_disks..=max_disks)
}

/// Deterministic chaos stage: returns (peg0, peg1, disk_count)
/// Same stage id always produces same layout.
pub fn chaos_stage(stage_id: u8) -> (Vec<u8>, Vec<u8>, u8) {
    let (_, min_disks, max_disks) = stage_difficulty(stage_id);
    let mut rng = StdRng::seed_from_u64(stage_id as u64 * 6_271 + 31_337);

    let disk_count: u8 = if min_disks == max_disks {
        min_disks
    } else {
        rng.gen_range(min_disks..=max_disks)
    };

    let mut peg0: Vec<u8> = Vec::new();
    let mut peg1: Vec<u8> = Vec::new();

    // Assign disks largest-first so each peg stays in valid order
    for disk in (1..=disk_count).rev() {
        if rng.gen_bool(0.5) {
            peg0.push(disk);
        } else {
            peg1.push(disk);
        }
    }

    // Ensure neither peg is empty
    if peg0.is_empty() {
        peg0.push(peg1.remove(0));
    } else if peg1.is_empty() {
        peg1.push(peg0.remove(0));
    }

    (peg0, peg1, disk_count)
}
