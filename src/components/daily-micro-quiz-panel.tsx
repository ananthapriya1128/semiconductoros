"use client";

import { useEffect, useRef, useState } from "react";

const FLASHCARD_STORAGE_KEY = "semiconductoros-flashcards";
const QUIZ_STORAGE_KEY = "semiconductoros-microquiz";

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  category: string;
  lastReviewedAt?: number;
  nextReviewAt?: number;
  correctCount?: number;
  wrongCount?: number;
};

function getTodayKey() {
  const date = new Date();
  return date.toISOString().split("T")[0];
}

export function DailyMicroQuizPanel() {
  const hasHydrated = useRef(false);
  const [history, setHistory] = useState<any[]>([]);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [todaysQuestions, setTodaysQuestions] = useState<string[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [answers, setAnswers] = useState<{ [key: string]: boolean }>({});
  const [showResults, setShowResults] = useState(false);

  // Initial load from localStorage
  useEffect(() => {
    try {
      // Load flashcards
      const flashRaw = localStorage.getItem(FLASHCARD_STORAGE_KEY);
      let loadedFlashcards: Flashcard[] = flashRaw
        ? JSON.parse(flashRaw)
        : [
            { id: "1", question: "What is CTS?", answer: "Clock Tree Synthesis", category: "CTS" },
            { id: "2", question: "What is setup time?", answer: "Min time data must be stable before clock", category: "Timing" },
            { id: "3", question: "What is hold time?", answer: "Min time data must be stable after clock", category: "Timing" },
            { id: "4", question: "What is skew?", answer: "Difference in clock arrival times", category: "Timing" },
            { id: "5", question: "What is congestion?", answer: "Not enough routing tracks in an area", category: "Routing" },
          ];
      setFlashcards(loadedFlashcards);

      // Load quiz history
      const quizRaw = localStorage.getItem(QUIZ_STORAGE_KEY);
      const loadedQuiz = quizRaw ? JSON.parse(quizRaw) : [];
      const today = getTodayKey();
      const existing = loadedQuiz.find((h: any) => h.date === today);

      // Pick questions from flashcards
      const shuffled = [...loadedFlashcards]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5)
        .map((q) => q.id);

      setTodaysQuestions(shuffled);
      setHistory(loadedQuiz);

      if (existing) {
        setAnswers(existing.answers);
        setShowResults(existing.completed);
      }
    } catch {}
    hasHydrated.current = true;
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!hasHydrated.current) return;

    const today = getTodayKey();
    const todayIndex = history.findIndex((h: any) => h.date === today);
    let updated: any[];

    if (todayIndex >= 0) {
      updated = [...history];
      updated[todayIndex] = {
        ...updated[todayIndex],
        completed: showResults,
        answers
      };
    } else {
      updated = [
        {
          date: today,
          completed: showResults,
          answers
        },
        ...history
      ];
    }

    const oldStr = JSON.stringify(history);
    const newStr = JSON.stringify(updated);
    if (oldStr !== newStr) {
      localStorage.setItem(QUIZ_STORAGE_KEY, newStr);
      setHistory(updated);
    }
  }, [showResults, answers]);

  function submitAnswer() {
    const questionId = todaysQuestions[currentQIndex];
    const question = flashcards.find(q => q.id === questionId)!;
    const correct = userAnswer.toLowerCase().includes(question.answer.toLowerCase());
    setAnswers({ ...answers, [questionId]: correct });

    if (currentQIndex < todaysQuestions.length - 1) {
      setCurrentQIndex(currentQIndex + 1);
      setUserAnswer("");
    } else {
      setShowResults(true);
    }
  }

  const streak = history.filter((h: any) => h.completed).length;

  return (
    <div className="glass-card rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Daily Micro-Quiz</h2>
          <p className="mt-1 text-sm text-muted">
            Quiz based on your flashcards! 📚
          </p>
        </div>
        {streak > 0 && (
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Streak</p>
            <p className="mt-1 text-2xl font-bold text-[#ffd398]">🔥 {streak} days</p>
          </div>
        )}
      </div>

      {!showResults ? (
        <div className="mt-4 space-y-4">
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Question {currentQIndex + 1} of {todaysQuestions.length}</span>
            {todaysQuestions[currentQIndex] && (
              <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1">
                {flashcards.find(q => q.id === todaysQuestions[currentQIndex])?.category}
              </span>
            )}
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <p className="text-lg font-medium">
              {flashcards.find(q => q.id === todaysQuestions[currentQIndex])?.question}
            </p>
          </div>
          <div>
            <label className="text-sm text-muted">Your Answer</label>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitAnswer()}
              placeholder="Type your answer here..."
              className="mt-2 w-full min-h-[100px] rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
            />
          </div>
          <button
            type="button"
            onClick={submitAnswer}
            disabled={!userAnswer.trim()}
            className="mt-2 w-full rounded-2xl bg-[linear-gradient(135deg,#69a7ff,#8f7cff)] px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
          >
            {currentQIndex < todaysQuestions.length - 1 ? "Next Question" : "Finish Quiz"}
          </button>
        </div>
      ) : (
        <div className="mt-4 space-y-4">
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center">
            <p className="text-4xl font-bold text-[#8af0c8]">
              {Object.values(answers).filter(Boolean).length} / {todaysQuestions.length}
            </p>
            <p className="mt-1 text-sm text-muted">
              Great job! Add more flashcards to expand your quiz! 👍
            </p>
          </div>

          <div className="space-y-3">
            {todaysQuestions.map(id => {
              const q = flashcards.find(x => x.id === id)!;
              return (
                <div key={id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">
                      {answers[id] ? "✅" : "❌"}
                    </span>
                    <div className="flex-1">
                      <p className="font-medium">{q.question}</p>
                      <p className="mt-1 text-sm text-white/80">
                        Correct answer: {q.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}