"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  createDefaultDailyPlan,
  getPlannedHours,
  getTodayKey,
  MEMORY_UPDATED_EVENT,
  STORAGE_KEYS,
  type DailyPlanMemory,
} from "@/lib/agent-memory";

function loadDailyPlan(): { plan: DailyPlanMemory; rolledOverCount: number } {
  const today = getTodayKey();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.dailyPlan);

    if (!raw) {
      return { plan: createDefaultDailyPlan(today), rolledOverCount: 0 };
    }

    const parsed = JSON.parse(raw) as DailyPlanMemory;

    if (parsed.date === today) {
      return { plan: parsed, rolledOverCount: 0 };
    }

    const rolledTasks = (parsed.tasks ?? [])
      .filter((task) => !task.completed)
      .map((task) => ({ ...task, completed: false }));

    return {
      plan: {
        date: today,
        goal: parsed.goal || createDefaultDailyPlan(today).goal,
        tasks: rolledTasks.length > 0 ? rolledTasks : createDefaultDailyPlan(today).tasks,
      },
      rolledOverCount: rolledTasks.length,
    };
  } catch {
    return { plan: createDefaultDailyPlan(today), rolledOverCount: 0 };
  }
}

export function DailyPlanPanel() {
  const hasHydratedRef = useRef(false);
  const [plan, setPlan] = useState<DailyPlanMemory>(() => createDefaultDailyPlan());
  const [rolledOverCount, setRolledOverCount] = useState(0);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskMinutes, setNewTaskMinutes] = useState("30");
  const [availableMinutes, setAvailableMinutes] = useState("120");
  const [isGenerating, setIsGenerating] = useState(false);
  const plannedHours = useMemo(() => getPlannedHours(plan), [plan]);

  useEffect(() => {
    const loaded = loadDailyPlan();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPlan(loaded.plan);
    setRolledOverCount(loaded.rolledOverCount);
    hasHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.dailyPlan, JSON.stringify(plan));
    window.dispatchEvent(new Event(MEMORY_UPDATED_EVENT));
  }, [plan]);

  async function generatePlan() {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          availableMinutes: Number(availableMinutes),
        }),
      });

      const data = await response.json();
      if (data.plan) {
        setPlan(data.plan);
      }
    } catch {
      // Fallback handled by API
    } finally {
      setIsGenerating(false);
    }
  }

  function toggleTask(id: string) {
    setPlan((current) => ({
      ...current,
      tasks: current.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    }));
  }

  function removeTask(id: string) {
    setPlan((current) => ({
      ...current,
      tasks: current.tasks.filter((task) => task.id !== id),
    }));
  }

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newTaskTitle.trim();
    const durationMinutes = Number(newTaskMinutes);

    if (!title || Number.isNaN(durationMinutes) || durationMinutes <= 0) {
      return;
    }

    setPlan((current) => ({
      ...current,
      tasks: [
        ...current.tasks,
        {
          id: `${Date.now()}`,
          title,
          durationMinutes,
          completed: false,
        },
      ],
    }));

    setNewTaskTitle("");
    setNewTaskMinutes("30");
  }

  return (
    <div className="glass-card rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Daily Plan Memory</h2>
          <p className="mt-1 text-sm text-muted">
            Saved on this device and reused by your mentor.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Today</p>
          <p className="mt-1 text-base font-semibold">{plannedHours}h planned</p>
        </div>
      </div>

      {rolledOverCount > 0 ? (
        <div className="mt-4 rounded-2xl border border-[#ffb65e]/20 bg-[#ffb65e]/10 p-3 text-sm text-[#ffd398]">
          {rolledOverCount} unfinished task{rolledOverCount > 1 ? "s" : ""} rolled
          into today&apos;s plan.
        </div>
      ) : null}

      <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_120px_auto]">
        <input
          value={availableMinutes}
          onChange={(e) => setAvailableMinutes(e.target.value)}
          type="number"
          min="30"
          step="15"
          placeholder="Available study time (minutes)"
          className="rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
        />
        <button
          type="button"
          onClick={generatePlan}
          disabled={isGenerating}
          className="rounded-2xl bg-[linear-gradient(135deg,#3dd598,#2cc689)] px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
        >
          {isGenerating ? "Generating..." : "Generate Plan"}
        </button>
      </div>

      <div className="mt-4">
        <label className="text-sm text-muted" htmlFor="goal-input">
          Today&apos;s goal
        </label>
        <input
          id="goal-input"
          value={plan.goal}
          onChange={(event) =>
            setPlan((current) => ({ ...current, goal: event.target.value }))
          }
          className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
        />
      </div>

      <div className="mt-4 space-y-3">
        {plan.tasks.map((task) => (
          <div
            key={task.id}
            className="rounded-2xl border border-white/8 bg-white/4 p-4"
          >
            <div className="flex items-center gap-3">
              <input
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
                type="checkbox"
                className="h-4 w-4 rounded border-white/20 bg-transparent"
              />
              <div className="flex-1">
                <p
                  className={`font-medium ${
                    task.completed ? "text-white/50 line-through" : "text-white"
                  }`}
                >
                  {task.title}
                </p>
                <p className="mt-1 text-sm text-muted">
                  {task.durationMinutes} minutes
                </p>
              </div>
              <button
                type="button"
                onClick={() => removeTask(task.id)}
                className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/80"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <form className="mt-4 grid gap-3 sm:grid-cols-[1fr_120px_auto]" onSubmit={addTask}>
        <input
          value={newTaskTitle}
          onChange={(event) => setNewTaskTitle(event.target.value)}
          placeholder="Add a study task"
          className="rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
        />
        <input
          value={newTaskMinutes}
          onChange={(event) => setNewTaskMinutes(event.target.value)}
          type="number"
          min="5"
          step="5"
          className="rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
        />
        <button
          type="submit"
          className="rounded-2xl bg-[linear-gradient(135deg,#69a7ff,#8f7cff)] px-4 py-3 font-semibold text-slate-950"
        >
          Add task
        </button>
      </form>
    </div>
  );
}
