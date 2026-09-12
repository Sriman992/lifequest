// --- Streaks: consecutive days of activity ---
// A "day" is a UTC calendar day, so streaks don't depend on timezone drift
// between the client and server.

function startOfUtcDay(d: Date): number {
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

export interface StreakUpdate {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
  streakIncreased: boolean;
}

export function updateStreak(
  lastActiveDate: Date | null,
  currentStreak: number,
  longestStreak: number,
  now: Date = new Date()
): StreakUpdate {
  const today = startOfUtcDay(now);

  if (!lastActiveDate) {
    return { currentStreak: 1, longestStreak: Math.max(1, longestStreak), lastActiveDate: now, streakIncreased: true };
  }

  const last = startOfUtcDay(lastActiveDate);
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((today - last) / dayMs);

  if (diffDays === 0) {
    // Already active today — no change, but not a regression either.
    return { currentStreak, longestStreak, lastActiveDate, streakIncreased: false };
  }
  if (diffDays === 1) {
    const next = currentStreak + 1;
    return { currentStreak: next, longestStreak: Math.max(next, longestStreak), lastActiveDate: now, streakIncreased: true };
  }
  // Missed one or more days — streak resets.
  return { currentStreak: 1, longestStreak: Math.max(1, longestStreak), lastActiveDate: now, streakIncreased: true };
}
