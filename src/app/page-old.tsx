import { CareerMemoryPanel } from "@/components/career-memory-panel";
import { DashboardClock } from "@/components/dashboard-clock";
import { DashboardSummary } from "@/components/dashboard-summary";
import { DailyPlanPanel } from "@/components/daily-plan-panel";
import { MentorPanel } from "@/components/mentor-panel";
import { RoadmapPanel } from "@/components/roadmap-panel";
import { StreakCard } from "@/components/streak-card";

const tasks = [
  { title: "Review floorplanning basics", time: "45 min", complete: true },
  { title: "Practice Linux commands", time: "30 min", complete: false },
  { title: "Solve 5 interview questions", time: "40 min", complete: false },
];

const news = [
  "NVIDIA expands AI infrastructure demand for advanced packaging.",
  "TSMC pushes new node roadmap with tighter performance-per-watt targets.",
  "Cadence and Synopsys continue to shape AI-assisted EDA workflows.",
];

const careerFocus = [
  "Master floorplanning, placement, CTS, routing, and STA in sequence",
  "Revise Linux and TCL daily for EDA workflow confidence",
  "Prepare company-specific answers for NVIDIA, AMD, Intel, Cadence, and Synopsys",
];

type HomeProps = {
  searchParams: Promise<{
    prompt?: string;
  }>;
};

const quickActions = [
  {
    label: "Ask AI Mentor",
    prompt: "Teach me floorplanning from basics",
  },
  {
    label: "Generate quiz",
    prompt: "Generate a quick 5 question quiz on RTL and STA basics",
  },
  {
    label: "Plan today",
    prompt: "Create a 3 hour semiconductor study plan for today",
  },
  {
    label: "Review notes",
    prompt: "Summarize what I should remember about CTS for interviews",
  },
];

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const initialPrompt =
    typeof params.prompt === "string" ? params.prompt : undefined;
  const hasLiveClaudeKey = Boolean(
    process.env.CLAUDE_API_KEY?.trim() &&
      process.env.CLAUDE_API_KEY !== "your_claude_api_key_here" &&
      !process.env.CLAUDE_API_KEY?.toLowerCase().includes("replace_with"),
  );

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <section className="glass-card rounded-[28px] p-5 sm:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted">SemiconductorOS</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Priya&apos;s AI semiconductor dashboard
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted sm:text-base">
                Fast MVP focused on one thing: getting your AI mentor live on
                your phone home screen with a clean daily study dashboard.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <DashboardClock />
            <StreakCard />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[1.4fr_0.9fr]">
            <DashboardSummary />

            <div className="glass-card rounded-3xl p-4">
              <p className="text-sm text-muted">Quick Actions</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {quickActions.map((action) => (
                  <a
                    key={action.label}
                    href={`/?prompt=${encodeURIComponent(action.prompt)}#mentor`}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90"
                  >
                    {action.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <MentorPanel
          hasLiveClaudeKey={hasLiveClaudeKey}
          initialPrompt={initialPrompt}
        />

        <div className="flex flex-col gap-6">
          <DailyPlanPanel />

          <CareerMemoryPanel />

          <RoadmapPanel />

          <div className="glass-card rounded-[28px] p-5">
            <h2 className="text-lg font-semibold">Career Focus</h2>
            <div className="mt-4 space-y-3">
              {careerFocus.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm leading-6 text-white/90"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[28px] p-5">
            <h2 className="text-lg font-semibold">Semiconductor News</h2>
            <div className="mt-4 space-y-3">
              {news.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm leading-6 text-white/90"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
