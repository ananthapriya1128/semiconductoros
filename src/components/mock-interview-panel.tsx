"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const INTERVIEW_TOPICS = [
  "Physical Design Basics",
  "Floorplanning",
  "Placement",
  "Clock Tree Synthesis (CTS)",
  "Routing",
  "Static Timing Analysis (STA)",
  "Timing (Setup & Hold)",
  "Linux & TCL",
  "OpenLANE",
  "DFT",
  "Low-Power Design",
  "Signoff & Verification"
];

const COMPANIES = [
  "Generic Semiconductor",
  "NVIDIA",
  "AMD",
  "Intel",
  "Qualcomm",
  "Apple",
  "Google",
  "Cadence",
  "Synopsys"
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced"] as const;

type InterviewQuestion = {
  question: string;
  expectedPoints: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  type: "theoretical" | "practical" | "problem-solving";
  followUp: string[];
};

type InterviewFeedback = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  modelAnswer: string;
};

type InterviewSession = {
  id: string;
  date: string;
  topic: string;
  company: string;
  difficulty: string;
  questions: InterviewQuestion[];
  answers: string[];
  feedbacks: InterviewFeedback[];
};

const STORAGE_KEY = "semiconductoros-interview-history";

export function MockInterviewPanel() {
  const [step, setStep] = useState<"setup" | "interview" | "feedback" | "history">("setup");
  const [topic, setTopic] = useState("Physical Design Basics");
  const [company, setCompany] = useState("Generic Semiconductor");
  const [difficulty, setDifficulty] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [feedbacks, setFeedbacks] = useState<InterviewFeedback[]>([]);
  const [history, setHistory] = useState<InterviewSession[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGettingFeedback, setIsGettingFeedback] = useState(false);
  const hasHydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setHistory(JSON.parse(raw));
      }
    } catch {}
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  async function startInterview() {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/mock-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, company, difficulty })
      });
      const data = await response.json();
      setQuestions(data.questions || []);
      setAnswers(new Array(data.questions?.length || 0).fill(""));
      setFeedbacks([]);
      setCurrentQuestionIndex(0);
      setCurrentAnswer("");
      setStep("interview");
    } catch {}
    setIsGenerating(false);
  }

  async function submitAnswer() {
    if (!questions[currentQuestionIndex]) return;
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = currentAnswer;
    setAnswers(newAnswers);
    setIsGettingFeedback(true);
    try {
      const response = await fetch("/api/interview-feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: questions[currentQuestionIndex].question,
          answer: currentAnswer,
          expectedPoints: questions[currentQuestionIndex].expectedPoints
        })
      });
      const feedback = await response.json();
      const newFeedbacks = [...feedbacks];
      newFeedbacks[currentQuestionIndex] = feedback;
      setFeedbacks(newFeedbacks);
    } catch {}
    setIsGettingFeedback(false);
    setStep("feedback");
  }

  function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setCurrentAnswer(answers[currentQuestionIndex + 1] || "");
      setStep("interview");
    } else {
      // Save to history
      const session: InterviewSession = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        topic,
        company,
        difficulty,
        questions,
        answers,
        feedbacks
      };
      setHistory([session, ...history]);
      setStep("history");
    }
  }

  function loadSession(session: InterviewSession) {
    setTopic(session.topic);
    setCompany(session.company);
    setDifficulty(session.difficulty as any);
    setQuestions(session.questions);
    setAnswers(session.answers);
    setFeedbacks(session.feedbacks);
    setCurrentQuestionIndex(0);
    setCurrentAnswer(session.answers[0] || "");
    setStep("feedback");
  }

  function resetToSetup() {
    setStep("setup");
    setQuestions([]);
    setAnswers([]);
    setFeedbacks([]);
    setCurrentQuestionIndex(0);
    setCurrentAnswer("");
  }

  return (
    <div className="glass-card rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Mock Interview</h2>
          <p className="mt-1 text-sm text-muted">
            Practice for your dream semiconductor job interview!
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={resetToSetup}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/85 transition hover:bg-white/10"
          >
            Setup
          </button>
          <button
            type="button"
            onClick={() => setStep("history")}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/85 transition hover:bg-white/10"
          >
            History ({history.length})
          </button>
        </div>
      </div>

      {step === "setup" && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="text-sm text-muted">Interview Topic</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
            >
              {INTERVIEW_TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm text-muted">Target Company</label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
              >
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm text-muted">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as any)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
              >
                {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <button
            type="button"
            onClick={startInterview}
            disabled={isGenerating}
            className="mt-2 w-full rounded-2xl bg-[linear-gradient(135deg,#3dd598,#2cc689)] px-4 py-3 font-semibold text-slate-950 transition disabled:opacity-50"
          >
            {isGenerating ? "Generating Questions..." : "Start Mock Interview"}
          </button>
        </div>
      )}

      {step === "interview" && questions[currentQuestionIndex] && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <div className="flex gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                {questions[currentQuestionIndex].difficulty}
              </span>
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                {questions[currentQuestionIndex].type}
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <p className="text-lg font-medium">{questions[currentQuestionIndex].question}</p>
            <details className="mt-3 text-sm text-muted">
              <summary className="cursor-pointer">Expected Points & Follow-Up Questions</summary>
              <div className="mt-2 space-y-2">
                <div>
                  <p className="font-medium">Expected points:</p>
                  <ul className="mt-1 ml-4 list-disc">
                    {questions[currentQuestionIndex].expectedPoints.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-medium">Follow-up questions:</p>
                  <ul className="mt-1 ml-4 list-disc">
                    {questions[currentQuestionIndex].followUp.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </details>
          </div>
          <div>
            <label className="text-sm text-muted">Your Answer</label>
            <textarea
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              placeholder="Write your answer here. Be clear, structured, and include examples!"
              className="mt-2 w-full min-h-[160px] rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={resetToSetup}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 font-semibold text-white transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submitAnswer}
              disabled={isGettingFeedback || !currentAnswer.trim()}
              className="w-full rounded-2xl bg-[linear-gradient(135deg,#69a7ff,#8f7cff)] px-4 py-3 font-semibold text-slate-950 transition disabled:opacity-50"
            >
              {isGettingFeedback ? "Getting Feedback..." : "Submit & Get Feedback"}
            </button>
          </div>
        </div>
      )}

      {step === "feedback" && questions[currentQuestionIndex] && feedbacks[currentQuestionIndex] && (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>
              Feedback for Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span
              className={`rounded-full px-3 py-1 font-bold ${
                feedbacks[currentQuestionIndex].score >= 80
                  ? "bg-[#3dd598]/12 text-[#8af0c8]"
                  : feedbacks[currentQuestionIndex].score >= 60
                    ? "bg-[#ffb65e]/12 text-[#ffd398]"
                    : "bg-[#ff5c5c]/12 text-[#ff8a8a]"
              }`}
            >
              {feedbacks[currentQuestionIndex].score}/100
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <p className="text-sm font-semibold text-[#8af0c8]">Strengths</p>
              <ul className="mt-2 space-y-1 text-sm">
                {feedbacks[currentQuestionIndex].strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#3dd598]">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
              <p className="text-sm font-semibold text-[#ffd398]">Areas to Improve</p>
              <ul className="mt-2 space-y-1 text-sm">
                {feedbacks[currentQuestionIndex].weaknesses.map((w, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[#ffb65e]">•</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <p className="text-sm font-semibold text-[#8af0c8]">Actionable Improvements</p>
            <ul className="mt-2 space-y-1 text-sm">
              {feedbacks[currentQuestionIndex].improvements.map((i, idx) => (
                <li key={idx} className="flex gap-2">
                  <span className="text-[#3dd598]">→</span>
                  {i}
                </li>
              ))}
            </ul>
          </div>
          <details className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <summary className="cursor-pointer text-sm font-semibold text-muted">
              Model Answer (What Recruiters Want To Hear)
            </summary>
            <p className="mt-2 text-sm leading-6">
              {feedbacks[currentQuestionIndex].modelAnswer}
            </p>
          </details>
          <button
            type="button"
            onClick={nextQuestion}
            className="mt-2 w-full rounded-2xl bg-[linear-gradient(135deg,#69a7ff,#8f7cff)] px-4 py-3 font-semibold text-slate-950"
          >
            {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish & Save Interview"}
          </button>
        </div>
      )}

      {step === "history" && (
        <div className="mt-4 space-y-3">
          {history.length === 0 && (
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center text-sm text-muted">
              No interview history yet. Start your first mock interview!
            </div>
          )}
          {history.map(session => (
            <div
              key={session.id}
              onClick={() => loadSession(session)}
              className="cursor-pointer rounded-2xl border border-white/8 bg-white/4 p-4 transition hover:bg-white/10"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{session.topic}</p>
                  <p className="text-sm text-muted">
                    {session.company} • {session.difficulty} • {new Date(session.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Avg Score</p>
                  <p className="font-bold text-[#8af0c8]">
                    {session.feedbacks.length > 0
                      ? Math.round(
                          session.feedbacks.reduce((acc, f) => acc + (f?.score || 0), 0) /
                            session.feedbacks.length
                        )
                      : "—"}
                    /100
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
