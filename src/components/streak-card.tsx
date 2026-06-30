"use client";

import { useEffect, useState } from "react";
import { getCurrentStreak, updateStreak } from "@/lib/streak";

export function StreakCard() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    setStreak(getCurrentStreak());
  }, []);

  const handleCompleteStudy = () => {
    const newStreak = updateStreak();
    setStreak(newStreak);
  };

  return (
    <div className="glass-card rounded-2xl px-4 py-3 text-right">
      <p className="text-xs uppercase tracking-[0.24em] text-muted">
        Mode
      </p>

      <p className="mt-1 text-lg font-semibold">
        Placement Mode
      </p>

      <p className="text-sm text-[#3dd598]">
        🔥 {streak} Day Streak
      </p>

      <button
        onClick={handleCompleteStudy}
        className="mt-3 rounded-lg bg-[#3dd598] px-3 py-2 text-sm font-medium text-black hover:opacity-90"
      >
        ✅ Complete Today's Study
      </button>
    </div>
  );
}