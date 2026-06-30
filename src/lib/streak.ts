const STREAK_KEY = "study_streak";
const LAST_DATE_KEY = "last_study_date";

export function getCurrentStreak(): number {
  if (typeof window === "undefined") return 0;

  return Number(localStorage.getItem(STREAK_KEY) || "0");
}

export function updateStreak(): number {
  if (typeof window === "undefined") return 0;

  const today = new Date();
  const todayStr = today.toDateString();

  const lastDate = localStorage.getItem(LAST_DATE_KEY);
  let streak = Number(localStorage.getItem(STREAK_KEY) || "0");

  // Already updated today
  if (lastDate === todayStr) {
    return streak;
  }

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (lastDate === yesterday.toDateString()) {
    streak += 1;
  } else {
    streak = 1;
  }

  localStorage.setItem(STREAK_KEY, streak.toString());
  localStorage.setItem(LAST_DATE_KEY, todayStr);

  return streak;
}

export function resetStreak() {
  if (typeof window === "undefined") return;

  localStorage.removeItem(STREAK_KEY);
  localStorage.removeItem(LAST_DATE_KEY);
}