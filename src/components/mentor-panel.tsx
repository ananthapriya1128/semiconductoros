"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

import {
  createDefaultDailyPlan,
  DEFAULT_CAREER_MEMORY,
  DEFAULT_ROADMAP,
  STORAGE_KEYS,
  type AgentMemory,
} from "@/lib/agent-memory";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type MentorPanelProps = {
  hasLiveClaudeKey: boolean;
  initialPrompt?: string;
};

const starterPrompts = [
  "Teach me floorplanning from basics",
  "Generate 10 NVIDIA PD interview questions",
  "Make a 3 hour study plan for today",
  "Explain CTS in simple words",
];

const initialMessages: Message[] = [
  {
    role: "assistant",
    content:
      "I am your Semiconductor Mentor. I can help with Physical Design, RTL, Linux, OpenLane, Cadence, interview prep, and study planning.",
  },
];

const CHAT_STORAGE_KEY = "semiconductoros-mentor-history";

function loadMentorMemory(): AgentMemory {
  const memory: AgentMemory = {
    career: DEFAULT_CAREER_MEMORY,
    dailyPlan: createDefaultDailyPlan(),
    roadmap: DEFAULT_ROADMAP,
  };

  try {
    const careerRaw = window.localStorage.getItem(STORAGE_KEYS.career);
    const dailyPlanRaw = window.localStorage.getItem(STORAGE_KEYS.dailyPlan);
    const roadmapRaw = window.localStorage.getItem(STORAGE_KEYS.roadmap);

    if (careerRaw) {
      memory.career = JSON.parse(careerRaw) as AgentMemory["career"];
    }

    if (dailyPlanRaw) {
      memory.dailyPlan = JSON.parse(dailyPlanRaw) as AgentMemory["dailyPlan"];
    }

    if (roadmapRaw) {
      memory.roadmap = JSON.parse(roadmapRaw) as AgentMemory["roadmap"];
    }
  } catch {
    // Ignore malformed memory and continue with defaults.
  }

  return memory;
}

export function MentorPanel({
  hasLiveClaudeKey,
  initialPrompt,
}: MentorPanelProps) {
  const autoPromptRef = useRef<string | null>(null);
  const hasHydratedRef = useRef(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const canSend = useMemo(
    () => input.trim().length > 0 && !isLoading,
    [input, isLoading],
  );

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CHAT_STORAGE_KEY);

      if (!raw) {
        hasHydratedRef.current = true;
        return;
      }

      const parsed = JSON.parse(raw) as Message[];

      if (Array.isArray(parsed) && parsed.length > 0) {
        setMessages(parsed);
      }
    } catch {
      // Ignore malformed local state and continue with the default mentor greeting.
    } finally {
      hasHydratedRef.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasHydratedRef.current) {
      return;
    }

    window.localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  async function sendMessage(prompt: string) {
    const trimmed = prompt.trim();

    if (!trimmed || isLoading) {
      return;
    }

    const nextMessages = [...messages, { role: "user" as const, content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/mentor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: nextMessages,
          memory: loadMentorMemory(),
        }),
      });

      const data = (await response.json()) as { message?: string; error?: string };

      if (!response.ok || !data.message) {
        throw new Error(data.error || "Unable to get mentor response.");
      }

      setMessages((current) => [
        ...current,
        { role: "assistant", content: data.message as string },
      ]);
    } catch (error) {
      const fallback =
        error instanceof Error
          ? error.message
          : "The mentor is temporarily unavailable.";

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            `${fallback} Add your Claude API key to enable live AI responses.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage(input);
  }

  function resetConversation() {
    setMessages(initialMessages);
    autoPromptRef.current = null;
    window.localStorage.removeItem(CHAT_STORAGE_KEY);
  }

  useEffect(() => {
    const prompt = initialPrompt?.trim();

    if (!prompt) {
      autoPromptRef.current = null;
      return;
    }

    if (autoPromptRef.current === prompt || isLoading) {
      return;
    }

    autoPromptRef.current = prompt;
    void sendMessage(prompt);
  }, [initialPrompt, isLoading]);

  return (
    <section
      id="mentor"
      className="glass-card rounded-[28px] p-5 scroll-mt-6 sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted">AI Mentor</p>
          <h2 className="mt-1 text-2xl font-semibold">Semiconductor Mentor</h2>
        </div>
        <div
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            hasLiveClaudeKey
              ? "bg-[#3dd598]/12 text-[#8af0c8]"
              : "bg-[#ffb65e]/12 text-[#ffd398]"
          }`}
        >
          {hasLiveClaudeKey ? "Live AI enabled" : "Guided mode active"}
        </div>
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <p className="text-sm leading-6 text-muted">
          {hasLiveClaudeKey
            ? "Live Claude responses are enabled for the mentor."
            : "The mentor now remembers your recent conversation on this device. Add a real Claude API key in .env.local to enable live AI replies."}
        </p>
        <button
          type="button"
          onClick={resetConversation}
          className="shrink-0 rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/85 transition hover:bg-white/10"
        >
          New chat
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {starterPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => void sendMessage(prompt)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-white/90 transition hover:bg-white/10"
          >
            {prompt}
          </button>
        ))}
      </div>

      <div className="mt-5 space-y-3">
        {messages.map((message, index) => (
          <div
            key={`${message.role}-${index}`}
            className={`rounded-3xl p-4 text-sm leading-6 ${
              message.role === "assistant"
                ? "border border-white/8 bg-white/4 text-white/90"
                : "ml-auto max-w-[85%] bg-[linear-gradient(135deg,#69a7ff,#8f7cff)] text-slate-950"
            }`}
          >
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] opacity-70">
              {message.role === "assistant" ? "Mentor" : "You"}
            </p>
            <p>{message.content}</p>
          </div>
        ))}

        {isLoading ? (
          <div className="rounded-3xl border border-white/8 bg-white/4 p-4 text-sm text-muted">
            Thinking about your semiconductor question...
          </div>
        ) : null}
      </div>

      <form className="mt-5" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="mentor-input">
          Ask the semiconductor mentor
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <textarea
            id="mentor-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about RTL, floorplanning, CTS, Linux, OpenLane, or interviews..."
            className="min-h-24 flex-1 rounded-3xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none placeholder:text-[#6c7687]"
          />
          <button
            type="submit"
            disabled={!canSend}
            className="rounded-3xl bg-[linear-gradient(135deg,#69a7ff,#8f7cff)] px-5 py-3 font-semibold text-slate-950 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Ask Mentor"}
          </button>
        </div>
      </form>
    </section>
  );
}
