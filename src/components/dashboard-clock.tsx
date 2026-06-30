"use client";

import { useEffect, useState } from "react";

function formatNow(date: Date) {
  return {
    time: new Intl.DateTimeFormat("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date),
    date: new Intl.DateTimeFormat("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date),
  };
}

export function DashboardClock() {
  const [now, setNow] = useState(() => formatNow(new Date()));

  useEffect(() => {
    const timer = window.setInterval(() => {
      setNow(formatNow(new Date()));
    }, 1000 * 30);

    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="glass-card rounded-2xl px-4 py-3 text-right">
      <p className="text-xs uppercase tracking-[0.24em] text-muted">Now</p>
      <p className="mt-1 text-lg font-semibold">{now.time}</p>
      <p className="text-sm text-muted">{now.date}</p>
    </div>
  );
}
