import {
  DEFAULT_CAREER_MEMORY,
  DEFAULT_ROADMAP,
  createDefaultDailyPlan,
  getRoadmapPriority,
  type AgentMemory,
} from "@/lib/agent-memory";

type MockInterviewRequest = {
  topic?: string;
  company?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  memory?: AgentMemory;
};

type InterviewQuestion = {
  question: string;
  expectedPoints: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "theoretical" | "practical" | "problem-solving";
  followUp: string[];
};

type InterviewFeedback = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
};

function hasConfiguredClaudeKey() {
  const apiKey = process.env.CLAUDE_API_KEY?.trim();
  return Boolean(
    apiKey && apiKey !== "your_claude_api_key_here" && !apiKey.toLowerCase().includes("replace_with")
  );
}

const systemPrompt = `You are a senior Physical Design Interviewer from a top semiconductor company (like NVIDIA, AMD, Intel, Qualcomm, etc.).

Your goal is to conduct realistic mock interviews for Physical Design Engineer roles.

When asked to generate questions, produce ONLY JSON in this format:
{
  "questions": [
    {
      "question": "text of the question",
      "expectedPoints": ["point 1", "point 2", "point 3"],
      "difficulty": "beginner|intermediate|advanced",
      "type": "theoretical|practical|problem-solving",
      "followUp": ["follow up 1", "follow up 2"]
    }
  ]
}

When asked to give feedback on an answer, produce ONLY JSON in this format:
{
  "score": 0-100,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": ["improvement 1", "improvement 2"]
}

Rules for questions:
- Focus on topics relevant to target company
- Mix theoretical, practical, and problem-solving questions
- Cover: floorplan, placement, CTS, routing, STA, timing, Linux, TCL, OpenLANE, synthesis, low-power design, DFT, signoff
- For NVIDIA: also ask about real-world scenarios, not just definitions
- Include follow-up questions

Rules for feedback:
- Be constructive and specific
- Give detailed, actionable feedback
- Rate answers based on interview readiness
- Tell what recruiters look for
- Give examples of better answers`;

function normalizeMemory(memory?: AgentMemory) {
  return {
    career: memory?.career ?? DEFAULT_CAREER_MEMORY,
    dailyPlan: memory?.dailyPlan ?? createDefaultDailyPlan(),
    roadmap: memory?.roadmap ?? DEFAULT_ROADMAP,
  };
}

function buildMemorySummary(memory?: AgentMemory) {
  const normalizedMemory = normalizeMemory(memory);
  const roadmapPriority = getRoadmapPriority(normalizedMemory.roadmap)
    .map((item) => `${item.title} (${item.progress}%)")
    .join(", ");
  const currentSkills = normalizedMemory.career.currentSkills.join(", ");
  return `Candidate information:
- Target role: ${normalizedMemory.career.targetRole}
- Interview track: ${normalizedMemory.career.interviewTrack}
- Weekly focus: ${normalizedMemory.career.weeklyFocus}
- Current skills: ${currentSkills}
- Roadmap priorities: ${roadmapPriority || "No roadmap saved"}`;
}

const fallbackQuestions = {
  questions: [
    {
      question: "What is the complete Physical Design flow from netlist to signoff?",
      expectedPoints: [
        "Floorplanning",
        "Placement",
        "Clock Tree Synthesis (CTS)",
        "Routing",
        "Static Timing Analysis (STA)",
        "Physical Verification (DRC, LVS)",
        "Signoff"
      ],
      difficulty: "beginner",
      type: "theoretical",
      followUp: [
        "Walk me through each stage in detail.",
        "What are the inputs and outputs of each stage?"
      ]
    },
    {
      question: "What is CTS and why is clock skew important?",
      expectedPoints: [
        "CTS = Clock Tree Synthesis",
        "Distributes clock from source to flip-flops",
        "Reduces skew: difference in clock arrival times",
        "High skew causes setup/hold violations",
        "Balances clock paths with buffers/inverters"
      ],
      difficulty: "intermediate",
      type: "theoretical",
      followUp: [
        "How do you fix high skew?",
        "What's the difference between useful skew and negative skew?"
      ]
    },
    {
      question: "You have a setup violation on a critical path. How do you fix it?",
      expectedPoints: [
        "Increase drive strength of cells",
        "Resize cells",
        "Add buffers",
        "Swap to faster cells",
        "Floorplan changes: move cells closer",
        "Re-synthesis",
        "Use useful skew"
      ],
      difficulty: "intermediate",
      type: "problem-solving",
      followUp: [
        "What if it's a hold violation instead?",
        "When would you use each method?"
      ]
    },
    {
      question: "Explain the difference between combinational and sequential logic.",
      expectedPoints: [
        "Combinational: no memory, output depends only on current input",
        "Sequential: has memory (flip-flops), output depends on current and past",
        "Combinational examples: AND, OR, NOT gates, MUX",
        "Sequential examples: flip-flops, registers, counters"
      ],
      difficulty: "beginner",
      type: "theoretical",
      followUp: [
        "Give examples of each",
        "Why is sequential logic needed?"
      ]
    },
    {
      question: "What is congestion and how do you reduce it?",
      expectedPoints: [
        "Congestion: not enough routing tracks",
        "Causes: high cell density, macros, long wires",
        "Solutions: floorplan changes, cell placement, cell padding, via minimization"
      ],
      difficulty: "intermediate",
      type: "practical",
      followUp: [
        "How does placement affects congestion?",
        "What are placement blockages?"
      ]
    }
  ]
};

function generateFallbackFeedback(answer: string) {
  const hasAnswer = answer.trim().length > 50;
  return {
    score: hasAnswer ? 65 : 40,
    strengths: hasAnswer ? [
      "You made an effort to answer the question",
      "Good attempt at covering key concepts"
    ] : [
      "Tried to respond"
    ],
    weaknesses: hasAnswer ? [
      "Could be more structured",
      "Missing some key points recruiters look for",
      "Could use more specific examples"
    ] : [
      "Answer too brief",
      "Need more detail",
      "Missing key concepts"
    ],
    improvements: hasAnswer ? [
      "Structure your answer clearly",
      "Include real-world examples",
      "Use technical terms correctly",
      "Practice speaking clearly and concisely"
    ] : [
      "Expand your answer with more detail",
      "Include key technical terms",
      "Give examples from projects or studies",
      "Structure answer using bullet points if needed"
    ]
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MockInterviewRequest;
    const topic = body.topic || "Physical Design Basics";
    const company = body.company || "Generic Semiconductor";
    const difficulty = body.difficulty || "intermediate";
    const memory = normalizeMemory(body.memory);
    const apiKey = process.env.CLAUDE_API_KEY?.trim();

    if (!hasConfiguredClaudeKey()) {
      return Response.json(fallbackQuestions);
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "anthropic-version": "2023-06-01",
        "x-api-key": apiKey as string
      },
      body: JSON.stringify({
        model: process.env.CLAUDE_MODEL ?? "claude-3-5-sonnet-latest",
        max_tokens: 1000,
        system: `${systemPrompt}\n\n${buildMemorySummary(memory)}`,
        messages: [
          {
            role: "user",
            content: `Generate 5 ${difficulty} ${topic} interview questions for a ${company} interview. Make them realistic and interview-ready. Mix theoretical, practical, and problem-solving questions. Include expected points and follow-up questions.`
          }
        ]
      })
    });

    if (!response.ok) {
      return Response.json(fallbackQuestions);
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
        return Response.json(JSON.parse(text));
      } catch {
        return Response.json(fallbackQuestions);
      }
    }

    return Response.json(fallbackQuestions);
  } catch {
    return Response.json(fallbackQuestions);
  }
}
