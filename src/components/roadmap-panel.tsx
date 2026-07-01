"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import {
  DEFAULT_ROADMAP,
  getRoadmapPriority,
  MEMORY_UPDATED_EVENT,
  STORAGE_KEYS,
  type RoadmapItem,
} from "@/lib/agent-memory";

function loadRoadmap() {
  try {
    // Clear old localStorage to use new links
    window.localStorage.removeItem(STORAGE_KEYS.roadmap);
    return DEFAULT_ROADMAP;
  } catch {
    return DEFAULT_ROADMAP;
  }
}

export function RoadmapPanel() {
  const hasHydratedRef = useRef(false);

  const [roadmap, setRoadmap] =
    useState<RoadmapItem[]>(DEFAULT_ROADMAP);

  const priorities = useMemo(
    () => getRoadmapPriority(roadmap),
    [roadmap],
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRoadmap(loadRoadmap());
    hasHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) return;

    window.localStorage.setItem(
      STORAGE_KEYS.roadmap,
      JSON.stringify(roadmap),
    );

    window.dispatchEvent(new Event(MEMORY_UPDATED_EVENT));
  }, [roadmap]);

  function updateCompletedHours(id: string, hours: number) {
    setRoadmap((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              completedHours: Math.min(
                hours,
                item.estimatedHours,
              ),
            }
          : item,
      ),
    );
  }

  function statusColor(status: string) {
    switch (status) {
      case "completed":
        return "text-green-400";
      case "current":
        return "text-blue-400";
      default:
        return "text-gray-400";
    }
  }

  return (
    <div className="glass-card rounded-[28px] p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">
            Physical Design Roadmap
          </h2>

          <p className="mt-1 text-sm text-muted">
            Follow this roadmap step by step.
          </p>
        </div>

        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Current Focus
          </p>

          <p className="mt-1 font-semibold">
            {priorities.length > 0
              ? priorities[0].title
              : "Completed"}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        {roadmap.map((item) => {
          const percent = Math.round(
            (item.completedHours /
              item.estimatedHours) *
              100,
          );

          return (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">
                    {item.title}
                  </h3>

                  <p className="text-sm text-muted">
                    {item.stage}
                  </p>
                </div>

                <span
                  className={`font-semibold ${statusColor(
                    item.status,
                  )}`}
                >
                  {item.status.toUpperCase()}
                </span>
              </div>

              <div className="mt-4 text-sm text-white/80">
                {item.completedHours} / {item.estimatedHours} Hours
              </div>

              <input
                type="range"
                min="0"
                max={item.estimatedHours}
                step="1"
                value={item.completedHours}
                onChange={(e) =>
                  updateCompletedHours(
                    item.id,
                    Number(e.target.value),
                  )
                }
                className="mt-3 w-full accent-[#8f7cff]"
              />

              <div className="mt-2 text-right text-sm text-[#69a7ff]">
                {percent}% Completed
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {item.youtube && (
                  <a
                    href={item.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-white/10 p-2 text-sm hover:bg-white/10 text-center transition"
                  >
                    ▶ YouTube
                  </a>
                )}
                {item.notes && (
                  <a
                    href={item.notes}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-white/10 p-2 text-sm hover:bg-white/10 text-center transition"
                  >
                    📄 Notes
                  </a>
                )}
                {item.practice && (
                  <a
                    href={item.practice}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-white/10 p-2 text-sm hover:bg-white/10 text-center transition"
                  >
                    💻 Practice
                  </a>
                )}
                {item.interview && (
                  <a
                    href={item.interview}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-xl border border-white/10 p-2 text-sm hover:bg-white/10 text-center transition"
                  >
                    🎤 Interview
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}