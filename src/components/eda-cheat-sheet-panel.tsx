"use client";

import { useState } from "react";

const CHEAT_SHEETS = [
  {
    id: "linux",
    title: "Linux Commands",
    description: "Essential commands for EDA workflow",
    icon: "💻",
    categories: [
      {
        title: "File & Directory",
        items: [
          { key: "ls -l", value: "List files in long format" },
          { key: "cd <dir>", value: "Change directory" },
          { key: "pwd", value: "Show current directory" },
          { key: "mkdir <name>", value: "Create directory" },
          { key: "rm <file>", value: "Remove file" },
          { key: "rm -rf <dir>", value: "Remove directory recursively" },
          { key: "cp <src> <dest>", value: "Copy file" },
          { key: "mv <src> <dest>", value: "Move/rename file" },
          { key: "touch <file>", value: "Create empty file" },
          { key: "cat <file>", value: "Show file contents" },
          { key: "head/tail <file>", value: "Show start/end of file" },
          { key: "less <file>", value: "View file with scrolling" },
          { key: "chmod +x <file>", value: "Make file executable" }
        ]
      },
      {
        title: "Search & Filter",
        items: [
          { key: "grep <pattern> <file>", value: "Search pattern in file" },
          { key: "grep -r <pattern> <dir>", value: "Recursive search" },
          { key: "find <dir> -name \"*.v\"", value: "Find Verilog files" },
          { key: "sed 's/old/new/g' <file>", value: "Replace text in file" },
          { key: "awk '{print $1}' <file>", value: "Extract first column" },
          { key: "sort <file>", value: "Sort lines" },
          { key: "uniq <file>", value: "Remove duplicates" }
        ]
      },
      {
        title: "Process & System",
        items: [
          { key: "ps aux", value: "Show all running processes" },
          { key: "top/htop", value: "Process monitor" },
          { key: "kill <pid>", value: "Kill a process" },
          { key: "df -h", value: "Disk usage" },
          { key: "free -h", value: "RAM usage" },
          { key: "date", value: "Show date/time" }
        ]
      },
      {
        title: "Git Basics",
        items: [
          { key: "git init", value: "Initialize git repo" },
          { key: "git status", value: "Check git status" },
          { key: "git add <files>", value: "Stage files" },
          { key: "git commit -m 'msg'", value: "Commit changes" },
          { key: "git log --oneline", value: "Commit history" },
          { key: "git pull", value: "Pull latest changes" },
          { key: "git push", value: "Push changes" },
          { key: "git checkout -b <branch>", value: "Create branch" }
        ]
      }
    ]
  },
  {
    id: "tcl",
    title: "TCL Scripting",
    description: "Useful TCL snippets for EDA tools",
    icon: "📜",
    categories: [
      {
        title: "Basics",
        items: [
          { key: "set var 42", value: "Set variable" },
          { key: "puts $var", value: "Print variable" },
          { key: "if {cond} { code }", value: "If statement" },
          { key: "for {set i 0} {$i < 10} {incr i} { puts $i }", value: "For loop" },
          { key: "foreach item $list { puts $item }", value: "Foreach loop" },
          { key: "proc func {a b} { return [expr $a + $b] }", value: "Define procedure" }
        ]
      },
      {
        title: "Files",
        items: [
          { key: "set f [open file.txt r]", value: "Open file for read" },
          { key: "set f [open file.txt w]", value: "Open file for write" },
          { key: "puts $f \"text\"", value: "Write to file" },
          { key: "gets $f line", value: "Read line from file" },
          { key: "close $f", value: "Close file" }
        ]
      }
    ]
  },
  {
    id: "openlane",
    title: "OpenLANE Flow Guide",
    description: "OpenLANE commands and troubleshooting",
    icon: "🛠️",
    categories: [
      {
        title: "Basic Flow",
        items: [
          { key: "cd openlane && make mount", value: "Start OpenLANE container" },
          { key: "./flow.tcl -design <design_name>", value: "Run full flow" },
          { key: "./flow.tcl -design <design> -from synthesis", value: "Run from synthesis" },
          { key: "./flow.tcl -design <design> -to routing", value: "Run up to routing" }
        ]
      },
      {
        title: "Common Errors & Fixes",
        items: [
          { key: "Timing violations", value: "Increase cell drive strength, use useful skew" },
          { key: "Congestion", value: "Adjust floorplan, add placement blockages" },
          { key: "DRC errors", value: "Adjust routing layers, increase via sizes" }
        ]
      }
    ]
  },
  {
    id: "sta",
    title: "Static Timing Analysis",
    description: "STA concepts and OpenSTA commands",
    icon: "⏱️",
    categories: [
      {
        title: "Key Concepts",
        items: [
          { key: "Setup Time", value: "Min time data must be stable before clock" },
          { key: "Hold Time", value: "Min time data must be stable after clock" },
          { key: "Skew", value: "Difference in clock arrival times" },
          { key: "Latency", value: "Delay from clock source to flip-flop" },
          { key: "Derate", value: "Timing derating factor for variation" }
        ]
      }
    ]
  }
];

export function EDACheatSheetPanel() {
  const [activeSheet, setActiveSheet] = useState(CHEAT_SHEETS[0]);
  const [search, setSearch] = useState("");

  return (
    <div className="glass-card rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">EDA Cheat Sheet Hub</h2>
          <p className="mt-1 text-sm text-muted">
            Quick reference for Linux, TCL, OpenLANE, and STA!
          </p>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          placeholder="Search cheat sheets..."
          className="w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
        />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {CHEAT_SHEETS.map((sheet) => (
          <button
            key={sheet.id}
            onClick={() => setActiveSheet(sheet)}
            className={`rounded-2xl border p-3 text-left transition ${
              activeSheet.id === sheet.id
                ? "border-[#69a7ff] bg-[#69a7ff]/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <span className="text-2xl">{sheet.icon}</span>
            <p className="mt-2 font-medium">{sheet.title}</p>
            <p className="mt-1 text-xs text-muted">{sheet.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {activeSheet.categories
          .map((category) => {
            const items = search
              ? category.items.filter(
                  (item) =>
                    item.key.toLowerCase().includes(search) ||
                    item.value.toLowerCase().includes(search)
                )
              : category.items;

            if (items.length === 0) return null;
            return (
              <div key={category.title} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                <h3 className="font-semibold">{category.title}</h3>
                <div className="mt-3 space-y-2">
                  {items.map((item, i) => (
                    <div key={i} className="grid gap-2 text-sm sm:grid-cols-[1fr_1.5fr]">
                      <span className="rounded-full border border-white/10 bg-[#07101d] px-3 py-1 font-mono text-xs">
                        {item.key}
                      </span>
                      <p className="text-muted">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
