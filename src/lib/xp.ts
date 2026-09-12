// --- The RPG Progression Engine ---
// Non-linear leveling: each level requires more XP than the last.
// xpToReachLevel(n) is monotonically increasing and its *increments* grow too,
// so level 2->3 costs more than 1->2, etc.

export function xpToReachLevel(level: number): number {
  // Total cumulative XP required to REACH this level from 0.
  // 50 * level^1.6 grows faster than linear -> non-linear difficulty curve.
  if (level <= 1) return 0;
  return Math.round(50 * Math.pow(level - 1, 1.6) + 50 * (level - 1));
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number; // 0..1
}

export function computeLevel(totalXp: number): LevelInfo {
  let level = 1;
  // Walk up while the user has enough XP to reach the next level.
  // Capped at 200 as a sanity bound; nobody is completing that many tasks.
  while (level < 200 && totalXp >= xpToReachLevel(level + 1)) {
    level += 1;
  }
  const floor = xpToReachLevel(level);
  const ceiling = xpToReachLevel(level + 1);
  const xpIntoLevel = totalXp - floor;
  const xpForNextLevel = ceiling - floor;
  return {
    level,
    xpIntoLevel,
    xpForNextLevel,
    progress: xpForNextLevel > 0 ? xpIntoLevel / xpForNextLevel : 1,
  };
}

const LEVEL_TITLES: [number, string][] = [
  [1, "Sleepy Scholar"],
  [3, "Note Taker"],
  [5, "Night Owl"],
  [8, "Steady Hand"],
  [12, "Deep Focuser"],
  [16, "Quiet Achiever"],
  [20, "Room Whisperer"],
  [25, "Lamp Keeper"],
  [30, "Dawn Chaser"],
  [40, "Study Sage"],
];

export function titleForLevel(level: number): string {
  let title = LEVEL_TITLES[0][1];
  for (const [threshold, name] of LEVEL_TITLES) {
    if (level >= threshold) title = name;
  }
  return title;
}

export type Difficulty = "EASY" | "MEDIUM" | "HARD";

export const DIFFICULTY_REWARDS: Record<Difficulty, { xp: number; embers: number }> = {
  EASY: { xp: 10, embers: 5 },
  MEDIUM: { xp: 20, embers: 10 },
  HARD: { xp: 35, embers: 18 },
};

export type AttributeKey = "FOCUS" | "VITALITY" | "DISCIPLINE" | "CREATIVITY" | "CALM";

export const ATTRIBUTES: { key: AttributeKey; label: string; color: string }[] = [
  { key: "FOCUS", label: "Focus", color: "#E8A24B" },
  { key: "VITALITY", label: "Vitality", color: "#7C9473" },
  { key: "DISCIPLINE", label: "Discipline", color: "#C97C82" },
  { key: "CREATIVITY", label: "Creativity", color: "#9B8BC4" },
  { key: "CALM", label: "Calm", color: "#7FA8B8" },
];

export function parseAttributeXp(json: string): Record<AttributeKey, number> {
  let parsed: Partial<Record<AttributeKey, number>> = {};
  try {
    parsed = JSON.parse(json || "{}");
  } catch {
    parsed = {};
  }
  const result = {} as Record<AttributeKey, number>;
  for (const a of ATTRIBUTES) result[a.key] = parsed[a.key] ?? 0;
  return result;
}
