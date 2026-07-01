import { CareerMemoryPanel } from "@/components/career-memory-panel";
import { DailyMicroQuizPanel } from "@/components/daily-micro-quiz-panel";
import { DashboardClock } from "@/components/dashboard-clock";
import { DashboardSummary } from "@/components/dashboard-summary";
import { DailyPlanPanel } from "@/components/daily-plan-panel";
import { EDACheatSheetPanel } from "@/components/eda-cheat-sheet-panel";
import { FlashcardSystem } from "@/components/flashcard-system";
import { InterviewQuestionBank } from "@/components/interview-question-bank";
import { JobTrackerPanel } from "@/components/job-tracker-panel";
import { MentorPanel } from "@/components/mentor-panel";
import { MockInterviewPanel } from "@/components/mock-interview-panel";
import { ProjectIdeaGenerator } from "@/components/project-idea-generator";
import { RoadmapPanel } from "@/components/roadmap-panel";
import { StreakCard } from "@/components/streak-card";
import { getNewsFromClaude } from "@/lib/news";

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
  {
    label: "Mock Interview",
    prompt: "",
    anchor: "#mentor"
  }
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
  const news = await getNewsFromClaude();

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
                    href={action.prompt
                      ? `/?prompt=${encodeURIComponent(action.prompt)}#mentor`
                      : "#mentor"
                    }
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
        <div className="flex flex-col gap-6">
          <MentorPanel
            hasLiveClaudeKey={hasLiveClaudeKey}
            initialPrompt={initialPrompt}
          />
          <MockInterviewPanel />
          <DailyMicroQuizPanel />
          <FlashcardSystem />
          <ProjectIdeaGenerator />
          <InterviewQuestionBank />
        </div>

        <div className="flex flex-col gap-6">
          <DailyPlanPanel />

          <CareerMemoryPanel />

          <RoadmapPanel />

          <JobTrackerPanel />

          <EDACheatSheetPanel />

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
