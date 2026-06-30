export type DailyTask = {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
};

export type DailyPlanMemory = {
  date: string;
  goal: string;
  tasks: DailyTask[];
};

export type RoadmapItem = {
  id: string;
  title: string;
  progress: number;
};

export type CareerProfileMemory = {
  name: string;
  targetRole: string;
  interviewTrack: string;
  weeklyFocus: string;
  mentorNote: string;
  targetCompanies: string[];
  currentSkills: string[];
};

export type AgentMemory = {
  career: CareerProfileMemory;
  dailyPlan: DailyPlanMemory;
  roadmap: RoadmapItem[];
};

export const STORAGE_KEYS = {
  career: "semiconductoros-career-memory",
  dailyPlan: "semiconductoros-daily-plan",
  roadmap: "semiconductoros-roadmap",
} as const;

export const MEMORY_UPDATED_EVENT = "semiconductoros-memory-updated";

export function getTodayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function createDefaultDailyPlan(date = getTodayKey()): DailyPlanMemory {
  return {
    date,
    goal: "Strengthen Physical Design basics and interview readiness",
    tasks: [
      {
        id: "task-floorplan",
        title: "Review floorplanning basics",
        durationMinutes: 45,
        completed: true,
      },
      {
        id: "task-linux",
        title: "Practice Linux and TCL commands",
        durationMinutes: 30,
        completed: false,
      },
      {
        id: "task-interview",
        title: "Solve 5 Physical Design interview questions",
        durationMinutes: 40,
        completed: false,
      },
    ],
  };
}

export const DEFAULT_CAREER_MEMORY: CareerProfileMemory = {
  name: "Priya",
  targetRole: "Physical Design Engineer",
  interviewTrack: "NVIDIA / Cadence",
  weeklyFocus: "Floorplanning, CTS, Linux, and interview revision",
  mentorNote:
    "Prefer concise explanations, placement-focused guidance, and daily action plans.",
  targetCompanies: [
    "NVIDIA",
    "AMD",
    "Intel",
    "Qualcomm",
    "Cadence",
    "Synopsys",
    "Apple",
    "Google",
  ],
  currentSkills: [
    "OpenLane",
    "Cadence basics",
    "Linux",
    "Digital electronics",
    "RTL basics",
  ],
};

export const DEFAULT_ROADMAP: RoadmapItem[] = [
  { id: "digital", title: "Digital Electronics", progress: 70 },
  { id: "rtl", title: "RTL Design", progress: 60 },
  { id: "verilog", title: "Verilog", progress: 58 },
  { id: "linux", title: "Linux", progress: 65 },
  { id: "tcl", title: "TCL", progress: 35 },
  { id: "floorplanning", title: "Floorplanning", progress: 42 },
  { id: "placement", title: "Placement", progress: 36 },
  { id: "cts", title: "CTS", progress: 28 },
  { id: "routing", title: "Routing", progress: 24 },
  { id: "sta", title: "STA", progress: 30 },
];

export function getPlannedHours(plan: DailyPlanMemory) {
  const minutes = plan.tasks.reduce((total, task) => total + task.durationMinutes, 0);
  return Math.round((minutes / 60) * 10) / 10;
}

export function getRoadmapPriority(roadmap: RoadmapItem[]) {
  return [...roadmap].sort((a, b) => a.progress - b.progress).slice(0, 3);
}
