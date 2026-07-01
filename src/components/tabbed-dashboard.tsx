"use client";

import { useState } from "react";
import { CareerMemoryPanel } from "@/components/career-memory-panel";
import { DailyMicroQuizPanel } from "@/components/daily-micro-quiz-panel";
import { DailyPlanPanel } from "@/components/daily-plan-panel";
import { EDACheatSheetPanel } from "@/components/eda-cheat-sheet-panel";
import { FlashcardSystem } from "@/components/flashcard-system";
import { InterviewQuestionBank } from "@/components/interview-question-bank";
import { JobTrackerPanel } from "@/components/job-tracker-panel";
import { MentorPanel } from "@/components/mentor-panel";
import { MockInterviewPanel } from "@/components/mock-interview-panel";
import { ProjectIdeaGenerator } from "@/components/project-idea-generator";
import { RoadmapPanel } from "@/components/roadmap-panel";

type DashboardTab = "mentor" | "study" | "interview" | "tools" | "plan";

const tabs: { id: DashboardTab; label: string; icon: string }[] = [
  { id: "mentor", label: "AI Mentor", icon: "🤖" },
  { id: "study", label: "Study Tools", icon: "📚" },
  { id: "interview", label: "Interview Prep", icon: "💼" },
  { id: "tools", label: "Cheat Sheets", icon: "🛠️" },
  { id: "plan", label: "Planner", icon: "📅" },
];

interface TabbedDashboardProps {
  hasLiveClaudeKey: boolean;
  initialPrompt?: string;
  news: string[];
}

export function TabbedDashboard({ hasLiveClaudeKey, initialPrompt, news }: TabbedDashboardProps) {
  const [activeTab, setActiveTab] = useState<DashboardTab>("mentor");

  const renderTabContent = () => {
    switch (activeTab) {
      case "mentor":
        return <MentorPanel hasLiveClaudeKey={hasLiveClaudeKey} initialPrompt={initialPrompt} />;
      case "study":
        return (
          <div className="space-y-6">
            <DailyMicroQuizPanel />
            <FlashcardSystem />
          </div>
        );
      case "interview":
        return (
          <div className="space-y-6">
            <MockInterviewPanel />
            <InterviewQuestionBank />
            <ProjectIdeaGenerator />
          </div>
        );
      case "tools":
        return (
          <div className="space-y-6">
            <EDACheatSheetPanel />
          </div>
        );
      case "plan":
        return (
          <div className="space-y-6">
            <DailyPlanPanel />
            <CareerMemoryPanel />
            <RoadmapPanel />
            <JobTrackerPanel />
            <div className="glass-card rounded-[28px] p-5">
              <h2 className="text-lg font-semibold">Semiconductor News</h2>
              <div className="mt-4 space-y-3">
                {news.map((item, i) => (
                  <div key={i} className="rounded-2xl border border-white/8 bg-white/4 p-4 text-sm leading-6 text-white/90">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2 p-2 rounded-3xl bg-white/5 border border-white/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-medium transition ${
              activeTab === tab.id
                ? "bg-[linear-gradient(135deg,#69a7ff,#8f7cff)] text-slate-950"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-2">
        {renderTabContent()}
      </div>
    </div>
  );
}
