import {
  DEFAULT_CAREER_MEMORY,
  DEFAULT_ROADMAP,
  createDefaultDailyPlan,
  type AgentMemory,
} from "@/lib/agent-memory";

type InterviewFeedbackRequest = {
  question: string;
  answer: string;
  expectedPoints?: string[];
  memory?: AgentMemory;
};

function hasConfiguredClaudeKey() {
  const apiKey = process.env.CLAUDE_API_KEY?.trim();
  return Boolean(
    apiKey && apiKey !== "your_claude_api_key_here" && !apiKey.toLowerCase().includes("replace_with")
  );
}

const systemPrompt = `You are a senior Physical Design Interviewer with experience at top semiconductor companies like NVIDIA, AMD, Intel, Qualcomm, etc.

Your job is to evaluate interview answers and give detailed, constructive feedback.

Return ONLY JSON in this format:
{
  "score": 0-100,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "improvements": ["improvement 1", "improvement 2"],
  "modelAnswer": "a strong example answer that would impress recruiters"
}

Rules:
- Be specific and actionable
- Focus on interview readiness
- Give feedback like a real interviewer
- Score based on clarity, depth, and completeness
- Explain what recruiters actually want
- Give concrete examples of better answers
- Keep feedback constructive and encouraging`;

function normalizeMemory(memory?: AgentMemory) {
  return {
    career: memory?.career ?? DEFAULT_CAREER_MEMORY,
    dailyPlan: memory?.dailyPlan ?? createDefaultDailyPlan(),
    roadmap: memory?.roadmap ?? DEFAULT_ROADMAP,
  };
}

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
    ],
    modelAnswer: "A strong answer would start with a clear definition, explain why it's important, where it fits in the flow, and give real examples from tools like OpenLANE or Cadence."
  };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as InterviewFeedbackRequest;
    const answer = body.answer || "";
    const question = body.question || "";
    const expectedPoints = body.expectedPoints || [];
    const memory = normalizeMemory(body.memory);
    const apiKey = process.env.CLAUDE_API_KEY?.trim();

    if (!hasConfiguredClaudeKey()) {
      return Response.json(generateFallbackFeedback(answer));
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
        max_tokens: 800,
        system: systemPrompt,
        messages: [
          {
            role: "user",
            content: `Evaluate this interview answer:\n\nQuestion: ${question}\n\nCandidate's Answer: ${answer}\n\nExpected points to cover: ${expectedPoints.join(", ")}`
          }
        ]
      })
    });

    if (!response.ok) {
      return Response.json(generateFallbackFeedback(answer));
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
        return Response.json(generateFallbackFeedback(answer));
      }
    }

    return Response.json(generateFallbackFeedback(answer));
  } catch {
    return Response.json(generateFallbackFeedback(""));
  }
}
