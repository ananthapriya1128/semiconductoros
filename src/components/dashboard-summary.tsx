"use client";

import { useEffect, useState } from "react";

import {
  createDefaultDailyPlan,
  DEFAULT_CAREER_MEMORY,
  getPlannedHours,
  MEMORY_UPDATED_EVENT,
  STORAGE_KEYS,
  type CareerProfileMemory,
  type DailyPlanMemory,
} from "@/lib/agent-memory";

function loadSummaryState() {
  let career = DEFAULT_CAREER_MEMORY;
  let dailyPlan = createDefaultDailyPlan();

  try {
    const careerRaw = window.localStorage.getItem(STORAGE_KEYS.career);
    const dailyPlanRaw = window.localStorage.getItem(STORAGE_KEYS.dailyPlan);

    if (careerRaw) {
      career = JSON.parse(careerRaw) as CareerProfileMemory;
    }

    if (dailyPlanRaw) {
      dailyPlan = JSON.parse(dailyPlanRaw) as DailyPlanMemory;
    }
  } catch {
    // Ignore malformed local state and continue with defaults.
  }

  return {
    goal: dailyPlan.goal,
    plannedHours: getPlannedHours(dailyPlan),
    interviewTrack: career.interviewTrack,
  };
}

export function DashboardSummary() {
  const [summary, setSummary] = useState(() => ({
    goal: createDefaultDailyPlan().goal,
    plannedHours: getPlannedHours(createDefaultDailyPlan()),
    interviewTrack: DEFAULT_CAREER_MEMORY.interviewTrack,
  }));

  useEffect(() => {
    const update = () => setSummary(loadSummaryState());

    update();
    window.addEventListener(MEMORY_UPDATED_EVENT, update);

    return () => {
      window.removeEventListener(MEMORY_UPDATED_EVENT, update);
    };
  }, []);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="glass-card rounded-3xl p-4">
        <p className="text-sm text-muted">Today&apos;s Goal</p>
        <p className="mt-3 text-lg font-semibold">{summary.goal}</p>
      </div>
      <div className="glass-card rounded-3xl p-4">
        <p className="text-sm text-muted">Planned Hours</p>
        <p className="mt-3 text-3xl font-semibold">{summary.plannedHours}h</p>
      </div>
      <div className="glass-card rounded-3xl p-4">
        <p className="text-sm text-muted">Interview Track</p>
        <p className="mt-3 text-lg font-semibold">{summary.interviewTrack}</p>
      </div>
    </div>
  );
}
