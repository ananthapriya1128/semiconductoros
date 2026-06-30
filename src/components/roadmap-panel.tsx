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
    const raw = window.localStorage.getItem(STORAGE_KEYS.roadmap);

    if (!raw) {
      return DEFAULT_ROADMAP;
    }

    return JSON.parse(raw) as RoadmapItem[];
  } catch {
    return DEFAULT_ROADMAP;
  }
}

export function RoadmapPanel() {
  const hasHydratedRef = useRef(false);
  const [roadmap, setRoadmap] = useState<RoadmapItem[]>(DEFAULT_ROADMAP);
  const priorities = useMemo(() => getRoadmapPriority(roadmap), [roadmap]);

  useEffect(() => {
    setRoadmap(loadRoadmap());
    hasHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.roadmap, JSON.stringify(roadmap));
    window.dispatchEvent(new Event(MEMORY_UPDATED_EVENT));
  }, [roadmap]);

  function updateProgress(id: string, progress: number) {
    setRoadmap((current) =>
      current.map((item) => (item.id === id ? { ...item, progress } : item)),
    );
  }

  return (
    <div className="glass-card rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Roadmap Memory</h2>
          <p className="mt-1 text-sm text-muted">
            Track what the mentor should prioritize next.
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">
            Priority
          </p>
          <p className="mt-1 text-sm font-semibold">
            {priorities.map((item) => item.title).join(" / ")}
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {roadmap.map((item) => (
          <div key={item.id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-medium">{item.title}</p>
              <span className="text-sm text-muted">{item.progress}%</span>
            </div>
            <input
              value={item.progress}
              onChange={(event) =>
                updateProgress(item.id, Number(event.target.value))
              }
              type="range"
              min="0"
              max="100"
              step="5"
              className="mt-3 w-full accent-[#8f7cff]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
