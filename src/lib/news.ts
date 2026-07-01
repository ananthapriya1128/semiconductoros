export function hasConfiguredClaudeKey() {
  const apiKey = process.env.CLAUDE_API_KEY?.trim();

  return Boolean(
    apiKey &&
      apiKey !== "your_claude_api_key_here" &&
      !apiKey.toLowerCase().includes("replace_with"),
  );
}

export const fallbackNews = [
  "NVIDIA expands AI infrastructure demand for advanced packaging.",
  "TSMC pushes new node roadmap with tighter performance-per-watt targets.",
  "Cadence and Synopsys continue to shape AI-assisted EDA workflows.",
];

export async function getNewsFromClaude() {
  try {
    const apiKey = process.env.CLAUDE_API_KEY?.trim();

    if (!hasConfiguredClaudeKey()) {
      return fallbackNews;
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
        max_tokens: 500,
        system:
          "You are a semiconductor industry news curator. Generate 3 concise, up-to-date (as of today) semiconductor industry news headlines that are relevant to someone studying physical design and semiconductor engineering. Return only a JSON array of 3 strings, no other text.",
        messages: [
          {
            role: "user",
            content: "Generate 3 semiconductor industry news headlines for today.",
          },
        ],
      }),
    });

    if (!response.ok) {
      return fallbackNews;
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
        const parsedNews = JSON.parse(text) as string[];
        if (Array.isArray(parsedNews) && parsedNews.length > 0) {
          return parsedNews.slice(0, 3);
        }
      } catch {
        // If parsing fails, use fallback
      }
    }

    return fallbackNews;
  } catch {
    return fallbackNews;
  }
}
