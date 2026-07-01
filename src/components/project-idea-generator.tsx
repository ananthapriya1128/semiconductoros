"use client";

import { useState } from "react";

type Project = {
  id: string;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  tools: string[];
  steps: string[];
  resumeTips: string[];
  tags: string[];
};

const PROJECTS: Project[] = [
  {
    id: "1",
    title: "4-bit Counter Synthesis & Floorplan",
    difficulty: "beginner",
    description: "Create a simple counter, run it through synthesis, and do basic floorplanning!",
    tools: ["Verilog", "Yosys", "OpenLANE"],
    steps: [
      "Write Verilog for 4-bit up-counter",
      "Simulate with ModelSim or Icarus Verilog (optional)",
      "Set up OpenLANE design directory",
      "Run synthesis with Yosys",
      "Perform basic floorplanning",
      "Analyze results: area, timing, congestion",
    ],
    resumeTips: [
      "Document your flow step by step with screenshots",
      "Highlight what you learned about synthesis and floorplanning",
      "Include metrics like area and timing in your resume bullet points",
    ],
    tags: ["Synthesis", "Floorplan", "Verilog", "OpenLANE"],
  },
  {
    id: "2",
    title: "UART Transceiver PD Flow",
    difficulty: "intermediate",
    description: "Complete PD flow for a UART from RTL to GDSII!",
    tools: ["Verilog", "Yosys", "OpenLANE", "OpenSTA", "KLayout"],
    steps: [
      "Write or find UART Verilog code",
      "Run full OpenLANE flow (synthesis to GDS)",
      "Fix any timing violations",
      "Run STA and analyze timing reports",
      "Verify with DRC/LVS checks",
      "Generate GDSII file",
    ],
    resumeTips: [
      "This is a strong project - put it at the top of your project section!",
      "Include screenshots of your GDS layout",
      "Talk about how you fixed timing violations (specific methods!)",
    ],
    tags: ["Full Flow", "STA", "DRC", "LVS", "UART"],
  },
  {
    id: "3",
    title: "Low Power Design with Clock Gating",
    difficulty: "advanced",
    description: "Implement clock gating for power reduction and run PD flow!",
    tools: ["Verilog", "Yosys", "OpenLANE", "OpenSTA", "Power Analysis"],
    steps: [
      "Write a small module (e.g., FIR filter) without clock gating",
      "Run PD flow and measure power consumption",
      "Add clock gating to the design",
      "Run PD flow again",
      "Compare power, area, and timing between both versions",
      "Document the improvements",
    ],
    resumeTips: [
      "Companies LOVE low power design experience!",
      "Quantify your power savings (e.g., 30% power reduction!)",
      "Explain the clock gating technique you used",
    ],
    tags: ["Low Power", "Clock Gating", "Power Analysis"],
  },
  {
    id: "4",
    title: "Floorplan Optimization for Congestion",
    difficulty: "intermediate",
    description: "Learn to fix congestion by optimizing floorplan and placement!",
    tools: ["OpenLANE", "Yosys", "KLayout"],
    steps: [
      "Use a medium size design (e.g., AES small core)",
      "Run initial flow, note congestion hotspots",
      "Try different floorplan aspect ratios",
      "Add placement blockages in congested areas",
      "Adjust macro placement",
      "Compare congestion, timing, and area",
    ],
    resumeTips: [
      "Shows you know how to debug and optimize PD flow!",
      "Include before/after congestion screenshots",
      "Talk about the methods you tried and what worked best",
    ],
    tags: ["Congestion", "Floorplan", "Placement", "Optimization"],
  },
];

export function ProjectIdeaGenerator() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "all" | "beginner" | "intermediate" | "advanced"
  >("all");

  const filteredProjects =
    selectedDifficulty === "all"
      ? PROJECTS
      : PROJECTS.filter((p) => p.difficulty === selectedDifficulty);

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
          <h2 className="text-lg font-semibold">Project Idea Generator</h2>
          <p className="mt-1 text-sm text-muted">
            Step-by-step physical design projects for your resume!
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { label: "All", value: "all" },
          { label: "Beginner", value: "beginner" },
          { label: "Intermediate", value: "intermediate" },
          { label: "Advanced", value: "advanced" },
        ].map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() =>
              setSelectedDifficulty(option.value as any)
            }
            className={`px-3 py-2 text-xs font-semibold rounded-full border transition ${
              selectedDifficulty === option.value
                ? "border-[#69a7ff] bg-[#69a7ff]/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            className="rounded-2xl border border-white/8 bg-white/4 p-4"
          >
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-lg font-semibold">{project.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                  project.difficulty
                )} border-current/30`}
              >
                {project.difficulty}
              </span>
            </div>

            <p className="text-sm text-muted mb-3">{project.description}</p>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted mb-2">
                Tools Needed
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tools.map((tool, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-full bg-white/5 border border-white/10"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted mb-2">
                Tags
              </p>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 rounded-full bg-[#69a7ff]/10 border border-[#69a7ff]/20 text-[#8ab6ff]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <details className="mb-3">
              <summary className="cursor-pointer text-sm font-semibold text-white/90">
                📋 Step-by-Step Guide
              </summary>
              <ol className="mt-3 space-y-2 ml-5 text-sm text-white/80 list-decimal">
                {project.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </details>

            <details>
              <summary className="cursor-pointer text-sm font-semibold text-white/90">
                💼 Resume Tips
              </summary>
              <ul className="mt-3 space-y-2 ml-5 text-sm text-white/80 list-disc">
                {project.resumeTips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}
