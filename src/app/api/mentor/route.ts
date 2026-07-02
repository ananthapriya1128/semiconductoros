import {
  DEFAULT_CAREER_MEMORY,
  DEFAULT_ROADMAP,
  createDefaultDailyPlan,
  getRoadmapPriority,
  type AgentMemory,
} from "@/lib/agent-memory";

type MentorMessage = {
  role: "user" | "assistant";
  content: string;
};

type MentorRequest = {
  messages?: MentorMessage[];
  memory?: AgentMemory;
};

function hasConfiguredClaudeKey() {
  const apiKey = process.env.CLAUDE_API_KEY?.trim();

  return Boolean(
    apiKey &&
      apiKey !== "your_claude_api_key_here" &&
      !apiKey.toLowerCase().includes("replace_with"),
  );
}

const systemPrompt = `You are Semiconductor Mentor, an expert AI mentor for Priya, a semiconductor engineering student preparing for physical design roles.

Rules:
- Be practical, concise, and beginner-friendly.
- Prioritize physical design, RTL, Verilog, SystemVerilog, Linux, TCL, Cadence, and OpenLane.
- When helpful, answer using short sections or bullet points.
- If the user asks for a plan, produce a structured study plan.
- If the user asks interview questions, tailor them for semiconductor companies.
- Keep responses focused and useful for placement preparation.
- Priya is targeting roles at NVIDIA, AMD, Intel, Qualcomm, Cadence, Synopsys, Apple, and Google.
- Priya currently knows OpenLane, Cadence basics, Linux, digital electronics, and RTL basics.
- Always guide her toward becoming placement-ready for Physical Design Engineer roles.
- Prefer actionable next steps, revision strategy, interview framing, and project suggestions over generic theory.`;

function buildCtsExplanation() {
  return `CTS stands for Clock Tree Synthesis.

- Purpose: distribute the clock signal from the source to all flip-flops with low skew and controlled delay.
- Why it matters: if clock arrival times vary too much, setup and hold timing can fail.
- Main goals:
  - reduce skew
  - control insertion delay
  - balance timing across registers
  - manage power and buffer count
- Typical flow:
  - start after placement
  - insert clock buffers/inverters
  - balance clock paths
  - analyze skew, latency, and transition
  - fix timing issues before routing cleanup
- Interview line: CTS is the stage where the clock network is built and optimized so sequential elements receive a stable, balanced clock.`;
}

function buildStudyPlan() {
  return `Here is a focused 3 hour study plan for today:

1. Physical Design basics: 45 min
- Review floorplanning, placement, CTS, routing, and STA flow.

2. Linux and TCL practice: 35 min
- Revise common commands, file navigation, grep, permissions, and simple TCL syntax.

3. OpenLane or Cadence revision: 40 min
- Revisit one complete flow and note each stage clearly.

4. Interview prep: 30 min
- Practice 5 questions on floorplanning, CTS, and setup/hold timing.

5. Quick revision notes: 30 min
- Write short notes on key formulas, definitions, and common interview traps.`;
}

function buildInterviewQuestions() {
  return `Here are 10 Physical Design interview questions for NVIDIA-style preparation:

1. What is the complete Physical Design flow from netlist to signoff?
2. What is floorplanning and what inputs are required for it?
3. What is congestion and how do you reduce it?
4. What is CTS and why is clock skew important?
5. What is the difference between setup violation and hold violation?
6. How do you fix setup violations in backend flow?
7. How do you fix hold violations in backend flow?
8. What is IR drop and why does it matter?
9. What is crosstalk and how can it affect timing?
10. What checks are usually performed during signoff?`;
}

function buildQuiz() {
  return `Quick quiz on RTL and STA basics:

1. What is the difference between combinational and sequential logic?
2. What is setup time?
3. What is hold time?
4. Why is clock skew important in synchronous design?
5. What is the role of synthesis between RTL and Physical Design?

Try answering these first, then ask the mentor to review your answers.`;
}

function buildRoadmap() {
  return `Placement-focused roadmap for Priya:

1. Strengthen foundations
- Digital electronics
- RTL design flow
- Verilog and SystemVerilog basics

2. Build backend core
- floorplanning
- placement
- CTS
- routing
- STA
- signoff basics

3. Tool confidence
- Linux commands
- TCL basics
- OpenLane workflow
- Cadence flow overview

4. Interview readiness
- Prepare short answers for each Physical Design stage
- Revise setup, hold, skew, congestion, IR drop, and crosstalk
- Practice company-focused interview questions

5. Portfolio proof
- Complete one OpenLane-based mini project
- Document the flow, issues, fixes, and learning clearly`;
}

function buildProjectSuggestion() {
  return `Useful project idea for your career:

Project: Mini Physical Design Case Study using OpenLane

- Pick a small RTL block
- Run synthesis to routing in OpenLane
- Record area, timing, and congestion observations
- Explain where floorplanning, placement, CTS, and routing affected results
- Write a short report with screenshots and learning points

Why this helps:
- gives you a portfolio story
- helps in interviews
- shows practical backend understanding instead of theory only`;
}

function normalizeMemory(memory?: AgentMemory): AgentMemory {
  return {
    career: memory?.career ?? DEFAULT_CAREER_MEMORY,
    dailyPlan: memory?.dailyPlan ?? createDefaultDailyPlan(),
    roadmap: memory?.roadmap ?? DEFAULT_ROADMAP,
  };
}

function buildMemorySummary(memory?: AgentMemory) {
  const normalizedMemory = normalizeMemory(memory);
  const roadmapPriority = getRoadmapPriority(normalizedMemory.roadmap)
    .map((item) => {
  const progress =
    item.estimatedHours > 0
      ? Math.round((item.completedHours / item.estimatedHours) * 100)
      : 0;

  return `${item.title} (${progress}%)`;
})
    .join(", ");
  const incompleteTasks = normalizedMemory.dailyPlan.tasks
    .filter((task) => !task.completed)
    .slice(0, 4)
    .map((task) => `${task.title} (${task.durationMinutes} min)`)
    .join(", ");

  return `Saved Priya memory:
- Target role: ${normalizedMemory.career.targetRole}
- Interview track: ${normalizedMemory.career.interviewTrack}
- Weekly focus: ${normalizedMemory.career.weeklyFocus}
- Mentor note: ${normalizedMemory.career.mentorNote}
- Current skills: ${normalizedMemory.career.currentSkills.join(", ")}
- Today's goal: ${normalizedMemory.dailyPlan.goal}
- Incomplete tasks: ${incompleteTasks || "No active tasks saved"}
- Roadmap priorities: ${roadmapPriority || "No roadmap saved"}`;
}

function buildGenericResponse(latestMessage: string, memory?: AgentMemory) {
  const normalizedMemory = normalizeMemory(memory);

  return `The AI mentor is running in guided fallback mode right now with career-focused guidance.

You asked: "${latestMessage}"

Saved context:
- Interview track: ${normalizedMemory.career.interviewTrack}
- Weekly focus: ${normalizedMemory.career.weeklyFocus}
- Today's goal: ${normalizedMemory.dailyPlan.goal}

Recommended response structure:
- Basics: define the concept in simple words
- Workflow: explain where it fits in the chip design flow
- Interview points: list the 3-5 things recruiters ask most
- Practice: solve one small task or note-making exercise

Priority topics for you:
- floorplanning
- placement
- CTS
- routing
- STA
- Linux
- TCL
- OpenLane basics

Best next career move:
- build one solid Physical Design project
- revise timing concepts daily
- practice company-specific interview answers every week

Add a real Claude API key in .env.local to switch this mentor to live AI responses.`;
}

function buildFallbackResponse(latestMessage: string, memory?: AgentMemory) {
  const normalized = latestMessage.toLowerCase();

  if (normalized.includes("cts")) {
    return buildCtsExplanation();
  }

  if (normalized.includes("study plan") || normalized.includes("plan today")) {
    return buildStudyPlan();
  }

  if (
    normalized.includes("interview") ||
    normalized.includes("nvidia") ||
    normalized.includes("amd") ||
    normalized.includes("cadence")
  ) {
    return buildInterviewQuestions();
  }

  if (normalized.includes("quiz")) {
    return buildQuiz();
  }

  if (normalized.includes("roadmap")) {
    return buildRoadmap();
  }

  if (normalized.includes("project")) {
    return buildProjectSuggestion();
  }

  return buildGenericResponse(latestMessage, memory);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MentorRequest;
    const messages = body.messages ?? [];
    const memory = normalizeMemory(body.memory);
    const apiKey = process.env.CLAUDE_API_KEY?.trim();
    const latestUserMessage =
      [...messages].reverse().find((message) => message.role === "user")?.content ??
      "Help me plan semiconductor study.";

    if (!hasConfiguredClaudeKey()) {
      return Response.json({
        message: buildFallbackResponse(latestUserMessage, memory),
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
        max_tokens: 900,
        system: `${systemPrompt}\n\n${buildMemorySummary(memory)}`,
        messages: messages.map((message) => ({
          role: message.role === "assistant" ? "assistant" : "user",
          content: message.content,
        })),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      return Response.json(
        {
          error: `Claude API request failed: ${errorText}`,
        },
        { status: 500 },
      );
    }

    const data = (await response.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };

    const text = data.content
      ?.filter((item) => item.type === "text" && item.text)
      .map((item) => item.text)
      .join("\n\n")
      .trim();

    return Response.json({
      message: text || buildFallbackResponse(latestUserMessage, memory),
    });
  } catch {
    return Response.json(
      {
        error: "Unable to process mentor request.",
      },
      { status: 500 },
    );
  }
}
