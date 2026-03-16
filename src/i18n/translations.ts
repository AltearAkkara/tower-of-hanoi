export type Lang = "en" | "th";

export interface Translations {
  // Home
  homeTitle: string;
  homeSubtitle: string;
  startGame: string;
  settings: string;
  back: string;
  // Mode
  selectMode: string;
  modeClassicLabel: string;
  modeClassicDesc: string;
  modeChaosLabel: string;
  modeChaosDesc: string;
  modeForbiddenLabel: string;
  modeForbiddenDesc: string;
  modeForgottenLabel: string;
  modeForgottenDesc: string;
  // Stage
  selectStage: string;
  stage: string;
  // Difficulty (used as badge labels in stage list)
  selectDifficulty: string;
  difficultyEgg: string;
  difficultyOwlet: string;
  difficultyGreatOwl: string;
  difficultyMadOwl: string;
  // Game
  time: string;
  moves: string;
  best: string;
  newGame: string;
  exitLevel: string;
  formatExtraMoves: (n: number) => string;
  // Win dialog
  congratulations: string;
  perfectScore: string;
  playAgain: string;
  goToStages: string;
  movesImproved: string;
  timeImproved: string;
  newRecord: string;
  stagePerfect: string;
  stageTryHarder: string;
  // Settings
  settingsTitle: string;
  language: string;
  theme: string;
  clearProgress: string;
  clearProgressConfirm: string;
}

export const translations: Record<Lang, Translations> = {
  en: {
    homeTitle: "Tower of Hanoi",
    homeSubtitle: "by HorNokhook",
    startGame: "Start Game",
    settings: "Settings",
    back: "← Back",
    selectMode: "Select Mode",
    modeClassicLabel: "The Owl and Classic world",
    modeClassicDesc: "move all disks to the last peg",
    modeChaosLabel: "The Owl and Chaos world",
    modeChaosDesc: "Disks start scrambled across pegs, move all disks to the last peg",
    modeForbiddenLabel: "The Owl and Forbidden world",
    modeForbiddenDesc: "Can only move between adjacent pegs",
    modeForgottenLabel: "The Owl and Forgotten world",
    modeForgottenDesc: "Coming soon",
    selectStage: "Select Stage",
    stage: "Stage",
    selectDifficulty: "Select Difficulty",
    difficultyEgg: "Egg",
    difficultyOwlet: "Owlet",
    difficultyGreatOwl: "Great Owl",
    difficultyMadOwl: "Mad Owl",
    time: "Time",
    moves: "Moves",
    best: "Best",
    newGame: "Play Again",
    exitLevel: "Exit",
    formatExtraMoves: (n) => `${n} extra move${n === 1 ? "" : "s"}`,
    congratulations: "Congratulations!",
    perfectScore: "Perfect score!",
    playAgain: "Play Again",
    goToStages: "Stage Select",
    movesImproved: "New best moves!",
    timeImproved: "New best time!",
    newRecord: "New record!",
    stagePerfect: "Wow",
    stageTryHarder: "Meh",
    settingsTitle: "Settings",
    language: "Language",
    theme: "Theme",
    clearProgress: "Clear All Progress",
    clearProgressConfirm: "This will erase all stage records. Are you sure?",
  },
  th: {
    homeTitle: "Tower of Hanoi",
    homeSubtitle: "by HorNokhook",
    startGame: "เริ่มเกม",
    settings: "ตั้งค่า",
    back: "← กลับ",
    selectMode: "เลือกโหมด",
    modeClassicLabel: "นกฮูกกับโลกคลาสสิก",
    modeClassicDesc: "ย้ายแผ่นทั้งหมดไปยังเสาสุดท้าย",
    modeChaosLabel: "นกฮูกหับโลกแห่งความโกลาหล",
    modeChaosDesc: "แผ่นกระจายอยู่แต่ละเสา ย้ายทั้งหมดไปเสาสุดท้าย",
    modeForbiddenLabel: "นกฮูกกับโลกต้องห้าม",
    modeForbiddenDesc: "สามารถย้ายได้เฉพาะเสาที่ติดกันเท่านั้น",
    modeForgottenLabel: "นกฮูกกับโลกที่ถูกลืม",
    modeForgottenDesc: "เร็วๆ นี้",
    selectStage: "เลือกด่าน",
    stage: "ด่าน",
    selectDifficulty: "เลือกความยาก",
    difficultyEgg: "ไข่",
    difficultyOwlet: "นกฮูกน้อย",
    difficultyGreatOwl: "นกฮูกใหญ่",
    difficultyMadOwl: "นกฮูกคลั่ง",
    time: "เวลา",
    moves: "ครั้ง",
    best: "ดีสุด",
    newGame: "เล่นใหม่",
    exitLevel: "ออก",
    formatExtraMoves: (n) => `เกิน ${n} ครั้ง`,
    congratulations: "ยินดีด้วย!",
    perfectScore: "เพอร์เฟกต์!",
    playAgain: "เล่นใหม่",
    goToStages: "เลือกด่าน",
    movesImproved: "สถิติครั้งใหม่!",
    timeImproved: "สถิติเวลาใหม่!",
    newRecord: "สถิติใหม่!",
    stagePerfect: "บรรลุ",
    stageTryHarder: "อ่อนหัด",
    settingsTitle: "ตั้งค่า",
    language: "ภาษา",
    theme: "ธีม",
    clearProgress: "ลบข้อมูลทั้งหมด",
    clearProgressConfirm: "จะลบสถิติทุกด่าน แน่ใจไหม?",
  },
};
