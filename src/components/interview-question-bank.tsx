"use client";

import { useState } from "react";

type Question = {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  companies: string[];
};

const QUESTIONS: Question[] = [
  {
    id: "1",
    question: "What is setup time?",
    answer: "Minimum time data must be stable before the active clock edge arrives at a flip-flop.",
    category: "Timing",
    difficulty: "beginner",
    companies: ["NVIDIA", "AMD", "Intel", "Qualcomm"],
  },
  {
    id: "2",
    question: "What is hold time?",
    answer: "Minimum time data must remain stable after the active clock edge arrives at a flip-flop.",
    category: "Timing",
    difficulty: "beginner",
    companies: ["NVIDIA", "AMD", "Intel", "Qualcomm"],
  },
  {
    id: "3",
    question: "What is CTS? Why is it important?",
    answer: "Clock Tree Synthesis: builds balanced clock distribution network to minimize skew, reduce insertion delay, and meet timing.",
    category: "Physical Design",
    difficulty: "intermediate",
    companies: ["NVIDIA", "AMD", "Intel", "Qualcomm", "Apple"],
  },
  {
    id: "4",
    question: "How do you fix a setup violation?",
    answer: "Increase drive strength, resize cells, add buffers, use faster cells, floorplan changes, useful skew, logic restructuring, voltage upscaling.",
    category: "Timing",
    difficulty: "intermediate",
    companies: ["NVIDIA", "AMD", "Intel", "Qualcomm", "Apple", "Google"],
  },
  {
    id: "5",
    question: "How do you fix a hold violation?",
    answer: "Add delay buffers, downsize cells, increase wire length, route on higher resistance layers, add hold inverters.",
    category: "Timing",
    difficulty: "intermediate",
    companies: ["NVIDIA", "AMD", "Intel", "Qualcomm", "Apple"],
  },
  {
    id: "6",
    question: "What is congestion in physical design?",
    answer: "Not enough routing tracks available to connect all signals in a region. Can cause routing DRCs, timing issues, and longer runtime.",
    category: "Physical Design",
    difficulty: "intermediate",
    companies: ["NVIDIA", "AMD", "Intel", "Qualcomm"],
  },
  {
    id: "7",
    question: "How to fix congestion?",
    answer: "Change floorplan aspect ratio, add placement blockages, move macros, reduce cell density, use congestion-driven placement, layer bias, via minimization.",
    category: "Physical Design",
    difficulty: "intermediate",
    companies: ["NVIDIA", "AMD", "Intel", "Qualcomm", "Cadence"],
  },
  {
    id: "8",
    question: "What is DRC and LVS?",
    answer: "DRC: Design Rule Check - verifies layout meets foundry rules. LVS: Layout Versus Schematic - verifies layout matches schematic netlist.",
    category: "Signoff",
    difficulty: "beginner",
    companies: ["All"],
  },
  {
    id: "9",
    question: "What is static timing analysis (STA)?",
    answer: "Verifies timing of a design without simulating vectors. Checks setup/hold, max/min delays, across all corners.",
    category: "Signoff",
    difficulty: "intermediate",
    companies: ["NVIDIA", "AMD", "Intel", "Qualcomm", "Apple", "Google"],
  },
  {
    id: "10",
    question: "What is clock skew?",
    answer: "Difference in arrival times of the clock signal at different sequential elements.",
    category: "Timing",
    difficulty: "beginner",
    companies: ["All"],
  },
  {
    id: "11",
    question: "What is the complete PD flow from RTL to GDS?",
    answer: "1. Synthesis (RTL to Netlist), 2. Floorplan, 3. Placement, 4. CTS, 5. Routing, 6. STA, 7. DRC/LVS, 8. GDSII.",
    category: "Physical Design",
    difficulty: "beginner",
    companies: ["All"],
  },
  {
    id: "12",
    question: "What is IR drop?",
    answer: "Voltage drop in power distribution network (PDN) due to wire resistance. Can cause timing errors and functional failures.",
    category: "Signoff",
    difficulty: "intermediate",
    companies: ["NVIDIA", "AMD", "Intel", "Qualcomm"],
  },
  {
    id: "13",
    question: "Explain the difference between combinational and sequential logic.",
    answer: "Combinational: no memory, output depends only on current input (AND, OR, MUX). Sequential: has memory, output depends on current and past inputs (flip-flops, registers).",
    category: "Basics",
    difficulty: "beginner",
    companies: ["All"],
  },
  {
    id: "14",
    question: "What is a flip-flop?",
    answer: "A sequential circuit element that stores 1 bit of state. Captures input on active clock edge and holds it until next edge.",
    category: "Basics",
    difficulty: "beginner",
    companies: ["All"],
  },
  {
    id: "15",
    question: "What is useful skew?",
    answer: "Intentionally adding skew to help fix timing violations (e.g., add positive skew to fix setup, negative to fix hold).",
    category: "Timing",
    difficulty: "advanced",
    companies: ["NVIDIA", "AMD", "Intel", "Apple"],
  },
];

export function InterviewQuestionBank() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");
  const [selectedCompany, setSelectedCompany] = useState("All");

  const categories = ["All", ...new Set(QUESTIONS.map(q => q.category))];
  const companies = ["All", ...new Set(QUESTIONS.flatMap(q => q.companies).filter(c => c !== "All"))];

  const filteredQuestions = QUESTIONS.filter(q => {
    const categoryOk = selectedCategory === "All" || q.category === selectedCategory;
    const difficultyOk = selectedDifficulty === "all" || q.difficulty === selectedDifficulty;
    const companyOk = selectedCompany === "All" || q.companies.includes(selectedCompany);
    return categoryOk && difficultyOk && companyOk;
  });

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "beginner":
        return "bg-[#3dd598]/12 text-[#8af0c8]";
      case "intermediate":
        return "bg-[#ffb65e]/12 text-[#ffd398]";
      case "advanced":
        return "bg-[#ff5c5c]/12 text-[#ff8a8a]";
      default:
        return "bg-white/10 text-white/70";
    }
  };

  return (
    <div className="glass-card rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Interview Question Bank</h2>
          <p className="mt-1 text-sm text-muted">
            Curated PD questions organized by category, difficulty & company!
          </p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-sm text-muted">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-muted">Difficulty</label>
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as any)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
          >
            {["all", "beginner", "intermediate", "advanced"].map(diff => (
              <option key={diff} value={diff}>{diff.charAt(0).toUpperCase() + diff.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm text-muted">Company</label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
          >
            {companies.map(comp => (
              <option key={comp} value={comp}>{comp}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {filteredQuestions.length === 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center text-sm text-muted">
            No questions match your filters!
          </div>
        )}
        {filteredQuestions.map(q => (
          <div key={q.id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="flex items-center justify-between gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold rounded-full bg-white/5 border border-white/10 px-2 py-1 text-muted">
                  {q.category}
                </span>
                <span className={`text-xs font-semibold rounded-full border px-2 py-1 ${getDifficultyColor(q.difficulty)} border-current/30`}>
                  {q.difficulty}
                </span>
              </div>
            </div>
            <p className="font-semibold">{q.question}</p>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-semibold text-white/90">
                Show Answer
              </summary>
              <p className="mt-2 text-sm text-white/80">{q.answer}</p>
            </details>
            <div className="mt-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted mb-1">
                Companies that ask this:
              </p>
              <div className="flex flex-wrap gap-2">
                {q.companies.map((comp, i) => (
                  <span key={i} className="text-xs px-2 py-1 rounded-full bg-[#69a7ff]/10 border border-[#69a7ff]/20 text-[#8ab6ff]">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
