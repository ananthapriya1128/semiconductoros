"use client";

import { useEffect, useRef, useState } from "react";

import {
  DEFAULT_CAREER_MEMORY,
  MEMORY_UPDATED_EVENT,
  STORAGE_KEYS,
  type CareerProfileMemory,
} from "@/lib/agent-memory";

function loadCareerMemory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEYS.career);

    if (!raw) {
      return DEFAULT_CAREER_MEMORY;
    }

    return JSON.parse(raw) as CareerProfileMemory;
  } catch {
    return DEFAULT_CAREER_MEMORY;
  }
}

export function CareerMemoryPanel() {
  const hasHydratedRef = useRef(false);
  const [career, setCareer] = useState<CareerProfileMemory>(DEFAULT_CAREER_MEMORY);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCareer(loadCareerMemory());
    hasHydratedRef.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEYS.career, JSON.stringify(career));
    window.dispatchEvent(new Event(MEMORY_UPDATED_EVENT));
  }, [career]);

  return (
    <div className="glass-card rounded-[28px] p-5">
      <h2 className="text-lg font-semibold">Career Memory</h2>
      <p className="mt-1 text-sm text-muted">
        What the mentor should remember about your current focus.
      </p>

      <div className="mt-4 grid gap-4">
        <div>
          <label className="text-sm text-muted" htmlFor="interview-track">
            Interview track
          </label>
          <input
            id="interview-track"
            value={career.interviewTrack}
            onChange={(event) =>
              setCareer((current) => ({
                ...current,
                interviewTrack: event.target.value,
              }))
            }
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-muted" htmlFor="weekly-focus">
            Weekly focus
          </label>
          <textarea
            id="weekly-focus"
            value={career.weeklyFocus}
            onChange={(event) =>
              setCareer((current) => ({
                ...current,
                weeklyFocus: event.target.value,
              }))
            }
            className="mt-2 min-h-20 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
          />
        </div>

        <div>
          <label className="text-sm text-muted" htmlFor="mentor-note">
            Note for mentor
          </label>
          <textarea
            id="mentor-note"
            value={career.mentorNote}
            onChange={(event) =>
              setCareer((current) => ({
                ...current,
                mentorNote: event.target.value,
              }))
            }
            className="mt-2 min-h-24 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
          />
        </div>

        <div>
          <p className="text-sm text-muted">Target companies</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {career.targetCompanies.map((company) => (
              <span
                key={company}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/90"
              >
                {company}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
