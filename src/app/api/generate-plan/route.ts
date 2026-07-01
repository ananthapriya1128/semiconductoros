import {
  DEFAULT_CAREER_MEMORY,
  DEFAULT_ROADMAP,
  createDefaultDailyPlan,
  getRoadmapPriority,
  getTodayKey,
  type AgentMemory,
  type DailyPlanMemory,
} from "@/lib/agent-memory";

function hasConfiguredClaudeKey() {
  const apiKey = process.env.CLAUDE_API_KEY?.trim();
  return Boolean(
    apiKey &&
      apiKey !== "your_claude_api_key_here" &&
      !apiKey.toLowerCase().includes("replace_with")
  );
}

const systemPrompt = `You are Semiconductor Mentor, an expert AI mentor for a semiconductor engineering student preparing for physical design roles.

Your task is to generate a DAILY STUDY PLAN. Return ONLY a JSON object (no other text) in this format:
{
  "goal": "Today's main goal (e.g., 'Learn Linux file permissions and grep commands')",
  "tasks": [
    { "title": "Task 1 description", "durationMinutes": 30 },
    { "title": "Task 2 description", "durationMinutes": 45 }
  ]
}

Rules:
- The sum of all durationMinutes should be close to the requested available time.
- Tasks should be tailored to the current roadmap priority.
- Keep tasks practical and actionable.
- Focus on Physical Design, RTL, Linux, TCL, OpenLane, etc.
- Be beginner-friendly.
- No extra text before or after the JSON.`;

type GeneratePlanRequest = {
  availableMinutes: number;
  memory?: AgentMemory;
  flashcards?: any[];
  quizHistory?: any[];
};

function normalizeMemory(memory?: AgentMemory): AgentMemory {
  return {
    career: memory?.career ?? DEFAULT_CAREER_MEMORY,
    dailyPlan: memory?.dailyPlan ?? createDefaultDailyPlan(),
    roadmap: memory?.roadmap ?? DEFAULT_ROADMAP,
  };
}

function buildMemorySummary(memory?: AgentMemory, flashcards?: any[], quizHistory?: any[]) {
  const normalizedMemory = normalizeMemory(memory);
  const roadmapPriority = getRoadmapPriority(normalizedMemory.roadmap)
    .map((item) => `${item.title} (${item.progress}%)`)
    .join(", ");
  const incompleteTasks = normalizedMemory.dailyPlan.tasks
    .filter((task) => !task.completed)
    .slice(0, 4)
    .map((task) => `${task.title} (${task.durationMinutes} min)`)
    .join(", ");

  const flashcardSummary = flashcards && flashcards.length > 0
    ? `Flashcards (${flashcards.length} total): ${flashcards.slice(0, 5).map(f => f.question).join(", ")}${flashcards.length > 5 ? "..." : ""}`
    : "No flashcards saved";

  const quizSummary = quizHistory && quizHistory.length > 0
    ? `Quiz streak: ${quizHistory.filter(h => h.completed).length} days`
    : "No quiz history";

  return `Saved user memory:
- Target role: ${normalizedMemory.career.targetRole}
- Interview track: ${normalizedMemory.career.interviewTrack}
- Weekly focus: ${normalizedMemory.career.weeklyFocus}
- Current skills: ${normalizedMemory.career.currentSkills.join(", ")}
- Roadmap priorities: ${roadmapPriority || "No roadmap saved"}
- Incomplete tasks from previous plans: ${incompleteTasks || "None"}
- ${flashcardSummary}
- ${quizSummary}`;
}

function generateFallbackPlan(availableMinutes: number): DailyPlanMemory {
  const today = getTodayKey();
  const tasks = [
    {
      id: "fallback-1",
      title: "Review roadmap priority topic",
      durationMinutes: Math.round(availableMinutes * 0.4),
      completed: false,
    },
    {
      id: "fallback-2",
      title: "Practice 5 interview questions",
      durationMinutes: Math.round(availableMinutes * 0.3),
      completed: false,
    },
    {
      id: "fallback-3",
      title: "Write revision notes",
      durationMinutes: Math.round(availableMinutes * 0.3),
      completed: false,
    },
  ].filter((t) => t.durationMinutes > 0);

  return {
    date: today,
    goal: "Complete today's study tasks",
    tasks,
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as GeneratePlanRequest;
    const availableMinutes = body.availableMinutes || 120;
    const memory = normalizeMemory(body.memory);
    const { flashcards, quizHistory } = body;
    const apiKey = process.env.CLAUDE_API_KEY?.trim();

    if (!hasConfiguredClaudeKey()) {
      return Response.json({
        plan: generateFallbackPlan(availableMinutes),
      });
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": apiKey as string,
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-latest",
        max_tokens: 600,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `${buildMemorySummary(memory, flashcards, quizHistory)}\n\nAvailable study time today: ${availableMinutes} minutes. Generate a daily plan.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      return Response.json({
        plan: generateFallbackPlan(availableMinutes),
      });
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };

    const text = data.content
      ?.filter((item) => item.type === "text" && item.text)
      .map((item) => item.text)
      .join("\n\n")
      .trim();

    if (text) {
      try {
        const parsedPlan = JSON.parse(text) as {
          goal: string;
          tasks: Array<{ title: string; durationMinutes: number }>;
        };
        const today = getTodayKey();
        const plan: DailyPlanMemory = {
          date: today,
          goal: parsedPlan.goal,
          tasks: parsedPlan.tasks.map((task, index) => ({
            id: `ai-task-${Date.now()}-${index}`,
            title: task.title,
            durationMinutes: task.durationMinutes,
            completed: false,
          })),
        };
        return Response.json({ plan });
      } catch {
        return Response.json({
          plan: generateFallbackPlan(availableMinutes),
        });
      }
    }

    return Response.json({
      plan: generateFallbackPlan(availableMinutes),
    });
  } catch {
    const availableMinutes = 120;
    return Response.json({
      plan: generateFallbackPlan(availableMinutes),
    });
  }
}
