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

export type RoadmapStatus = "completed" | "current" | "locked";

export type RoadmapItem = {
  id: string;
  title: string;
  stage: string;
  status: RoadmapStatus;
  estimatedHours: number;
  completedHours: number;
  youtube: string;
  notes: string;
  practice: string;
  interview: string;
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

export function createDefaultDailyPlan(
  date = getTodayKey(),
): DailyPlanMemory {
  return {
    date,
    goal: "Strengthen Physical Design basics and interview readiness",
    tasks: [
      {
        id: "task-linux",
        title: "Learn Linux Basics",
        durationMinutes: 60,
        completed: false,
      },
      {
        id: "task-git",
        title: "Practice Git Commands",
        durationMinutes: 45,
        completed: false,
      },
      {
        id: "task-tcl",
        title: "Introduction to TCL Scripting",
        durationMinutes: 60,
        completed: false,
      },
    ],
  };
}

export const DEFAULT_CAREER_MEMORY: CareerProfileMemory = {
  name: "Priya",
  targetRole: "Physical Design Engineer",
  interviewTrack: "NVIDIA / Cadence",
  weeklyFocus: "Linux, TCL, Floorplanning and Interview Preparation",
  mentorNote:
    "Provide placement-focused explanations, practical labs and interview preparation.",
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
    "Linux",
    "Digital Electronics",
    "Verilog Basics",
    "RTL Basics",
    "OpenLane",
  ],
};

export const DEFAULT_ROADMAP: RoadmapItem[] = [
  {
    id: "linux",
    title: "Linux Basics",
    stage: "Foundation",
    status: "current",
    estimatedHours: 10,
    completedHours: 0,
    youtube: "https://www.youtube.com/results?search_query=linux+basics+for+beginners+full+course",
    notes: "https://linuxjourney.com/",
    practice: "https://overthewire.org/wargames/bandit/",
    interview: "https://www.interviewbit.com/linux-interview-questions/",
  },
  {
    id: "git",
    title: "Git & GitHub",
    stage: "Foundation",
    status: "locked",
    estimatedHours: 4,
    completedHours: 0,
    youtube: "https://www.youtube.com/results?search_query=git+and+github+tutorial+for+beginners",
    notes: "https://git-scm.com/doc",
    practice: "https://learngitbranching.js.org/",
    interview: "https://www.interviewbit.com/git-interview-questions/",
  },
  {
    id: "tcl",
    title: "TCL Scripting",
    stage: "Foundation",
    status: "locked",
    estimatedHours: 12,
    completedHours: 0,
    youtube: "https://www.youtube.com/results?search_query=tcl+scripting+tutorial+for+vlsi",
    notes: "https://www.tcl.tk/doc/tutorial/tutorial.html",
    practice: "https://www.tutorialspoint.com/execute_tcl_online.php",
    interview: "https://www.vlsisystemdesign.com/tcl-interview-questions/",
  },
  {
    id: "digital",
    title: "Digital Electronics",
    stage: "Digital Design",
    status: "locked",
    estimatedHours: 20,
    completedHours: 0,
    youtube: "https://www.youtube.com/results?search_query=digital+electronics+full+course",
    notes: "https://www.nptel.ac.in/courses/106106144/",
    practice: "https://www.edaplayground.com/",
    interview: "https://www.interviewbit.com/digital-electronics-interview-questions/",
  },
  {
    id: "verilog",
    title: "Verilog HDL",
    stage: "RTL Design",
    status: "locked",
    estimatedHours: 25,
    completedHours: 0,
    youtube: "https://www.youtube.com/results?search_query=verilog+tutorial+for+beginners",
    notes: "https://verilogguide.readthedocs.io/",
    practice: "https://www.edaplayground.com/",
    interview: "https://www.interviewbit.com/verilog-interview-questions/",
  },
  {
    id: "synthesis",
    title: "Logic Synthesis",
    stage: "Synthesis",
    status: "locked",
    estimatedHours: 18,
    completedHours: 0,
    youtube: "https://www.youtube.com/results?search_query=logic+synthesis+vlsi+tutorial",
    notes: "https://www.vlsisystemdesign.com/logic-synthesis/",
    practice: "https://github.com/YosysHQ/yosys",
    interview: "https://vlsiinterviewquestions.blogspot.com/2012/08/synthesis-interview-questions.html",
  },
  {
    id: "floorplanning",
    title: "Floorplanning",
    stage: "Physical Design",
    status: "locked",
    estimatedHours: 20,
    completedHours: 0,
    youtube: "https://www.youtube.com/results?search_query=floorplanning+physical+design+vlsi",
    notes: "https://www.vlsisystemdesign.com/floorplanning/",
    practice: "https://github.com/The-OpenROAD-Project/OpenROAD",
    interview: "https://www.vlsijobs4u.com/2019/12/floorplanning-interview-questions-answers.html",
  },
  {
    id: "placement",
    title: "Placement",
    stage: "Physical Design",
    status: "locked",
    estimatedHours: 18,
    completedHours: 0,
    youtube: "https://www.youtube.com/results?search_query=placement+physical+design+vlsi",
    notes: "https://www.vlsisystemdesign.com/placement/",
    practice: "https://github.com/The-OpenROAD-Project/OpenROAD",
    interview: "https://www.vlsijobs4u.com/2019/12/placement-interview-questions-answers.html",
  },
  {
    id: "cts",
    title: "Clock Tree Synthesis",
    stage: "Physical Design",
    status: "locked",
    estimatedHours: 18,
    completedHours: 0,
    youtube: "https://www.youtube.com/results?search_query=clock+tree+synthesis+cts+vlsi",
    notes: "https://www.vlsisystemdesign.com/clock-tree-synthesis/",
    practice: "https://github.com/The-OpenROAD-Project/OpenROAD",
    interview: "https://www.vlsijobs4u.com/2019/12/cts-interview-questions-answers.html",
  },
  {
    id: "routing",
    title: "Routing",
    stage: "Physical Design",
    status: "locked",
    estimatedHours: 20,
    completedHours: 0,
    youtube: "https://www.youtube.com/results?search_query=routing+physical+design+vlsi",
    notes: "https://www.vlsisystemdesign.com/routing/",
    practice: "https://github.com/The-OpenROAD-Project/OpenROAD",
    interview: "https://www.vlsijobs4u.com/2019/12/routing-interview-questions-answers.html",
  },
  {
    id: "sta",
    title: "Static Timing Analysis",
    stage: "Timing Analysis",
    status: "locked",
    estimatedHours: 30,
    completedHours: 0,
    youtube: "https://www.youtube.com/results?search_query=static+timing+analysis+sta+vlsi",
    notes: "https://www.vlsisystemdesign.com/static-timing-analysis/",
    practice: "https://github.com/The-OpenROAD-Project/OpenSTA",
    interview: "https://www.vlsijobs4u.com/2019/12/sta-interview-questions-answers.html",
  },
];

export function getPlannedHours(plan: DailyPlanMemory) {
  const minutes = plan.tasks.reduce(
    (total, task) => total + task.durationMinutes,
    0,
  );

  return Math.round((minutes / 60) * 10) / 10;
}

export function getRoadmapPriority(
  roadmap: RoadmapItem[],
): RoadmapItem[] {
  return roadmap.filter((item) => item.status === "current");
}

export function getRoadmapProgress(
  roadmap: RoadmapItem[],
): number {
  const completed = roadmap.filter(
    (item) => item.status === "completed",
  ).length;

  return Math.round((completed / roadmap.length) * 100);
}

export function getCurrentRoadmapItem(
  roadmap: RoadmapItem[],
): RoadmapItem | undefined {
  return roadmap.find((item) => item.status === "current");
}