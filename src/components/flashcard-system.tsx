"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "semiconductoros-flashcards";

type Flashcard = {
  id: string;
  question: string;
  answer: string;
  category: string;
  interval: number;
  nextReview: string; // ISO date
  easeFactor: number;
  correctCount: number;
  wrongCount: number;
};

const DEFAULT_CARDS: Flashcard[] = [
  {
    id: "1",
    question: "What is setup time?",
    answer: "Minimum time data must be stable before clock edge arrives at flip-flop.",
    category: "Timing",
    interval: 1,
    nextReview: new Date().toISOString(),
    easeFactor: 2.5,
    correctCount: 0,
    wrongCount: 0,
  },
  {
    id: "2",
    question: "What is hold time?",
    answer: "Minimum time data must remain stable after clock edge arrives at flip-flop.",
    category: "Timing",
    interval: 1,
    nextReview: new Date().toISOString(),
    easeFactor: 2.5,
    correctCount: 0,
    wrongCount: 0,
  },
  {
    id: "3",
    question: "What is CTS?",
    answer: "Clock Tree Synthesis - builds balanced clock distribution to minimize skew.",
    category: "Physical Design",
    interval: 1,
    nextReview: new Date().toISOString(),
    easeFactor: 2.5,
    correctCount: 0,
    wrongCount: 0,
  },
  {
    id: "4",
    question: "What is congestion in PD?",
    answer: "Not enough routing tracks available to connect all signals in an area.",
    category: "Physical Design",
    interval: 1,
    nextReview: new Date().toISOString(),
    easeFactor: 2.5,
    correctCount: 0,
    wrongCount: 0,
  },
  {
    id: "5",
    question: "What does STA stand for?",
    answer: "Static Timing Analysis - verifies design timing without simulating.",
    category: "Signoff",
    interval: 1,
    nextReview: new Date().toISOString(),
    easeFactor: 2.5,
    correctCount: 0,
    wrongCount: 0,
  },
];

export function FlashcardSystem() {
  const hasHydrated = useRef(false);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [view, setView] = useState<"study" | "manage" | "add">("study");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("Timing");

  // Initial load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      let cards = raw ? JSON.parse(raw) : DEFAULT_CARDS;
      
      // If no cards, use defaults
      if (cards.length === 0) {
        cards = DEFAULT_CARDS;
      }
      
      setFlashcards(cards);
    } catch {
      setFlashcards(DEFAULT_CARDS);
    }
    hasHydrated.current = true;
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (!hasHydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(flashcards));
  }, [flashcards]);

  // Get cards due for review
  const getDueCards = () => {
    const now = new Date();
    return flashcards.filter(card => new Date(card.nextReview) <= now);
  };

  const dueCards = getDueCards();
  const currentCard = dueCards[currentCardIndex];

  // SRS algorithm (simple version)
  const handleAnswer = (correct: boolean) => {
    if (!currentCard) return;

    const updatedCards = [...flashcards];
    const cardIndex = updatedCards.findIndex(c => c.id === currentCard.id);
    if (cardIndex === -1) return;

    let card = { ...updatedCards[cardIndex] };
    
    if (correct) {
      card.correctCount++;
      card.interval = Math.round(card.interval * card.easeFactor);
      card.easeFactor += 0.1;
    } else {
      card.wrongCount++;
      card.interval = 1;
      card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
    }

    const nextDate = new Date();
    nextDate.setDate(nextDate.getDate() + card.interval);
    card.nextReview = nextDate.toISOString();

    updatedCards[cardIndex] = card;
    setFlashcards(updatedCards);

    // Move to next card
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setCurrentCardIndex(0);
    }
    setShowAnswer(false);
  };

  const addCard = (e: React.FormEvent) => {
    e.preventDefault();
    const newCard: Flashcard = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
      category: newCategory,
      interval: 1,
      nextReview: new Date().toISOString(),
      easeFactor: 2.5,
      correctCount: 0,
      wrongCount: 0,
    };
    setFlashcards([...flashcards, newCard]);
    setNewQuestion("");
    setNewAnswer("");
    setView("study");
  };

  const deleteCard = (id: string) => {
    setFlashcards(flashcards.filter(c => c.id !== id));
  };

  return (
    <div className="glass-card rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Flashcard System (SRS)</h2>
          <p className="mt-1 text-sm text-muted">
            Remember concepts forever with spaced repetition!
          </p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setView("study")}
            className={`px-3 py-2 text-xs font-semibold rounded-full border ${
              view === "study"
                ? "border-[#69a7ff] bg-[#69a7ff]/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            Study
          </button>
          <button
            type="button"
            onClick={() => setView("manage")}
            className={`px-3 py-2 text-xs font-semibold rounded-full border ${
              view === "manage"
                ? "border-[#69a7ff] bg-[#69a7ff]/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            Manage
          </button>
          <button
            type="button"
            onClick={() => setView("add")}
            className={`px-3 py-2 text-xs font-semibold rounded-full border ${
              view === "add"
                ? "border-[#3dd598] bg-[#3dd598]/20"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            + Add
          </button>
        </div>
      </div>

      {view === "study" && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-muted mb-4">
            <span>
              Due for review: <span className="font-bold">{dueCards.length}</span> / {flashcards.length}
            </span>
            {dueCards.length > 0 && (
              <span>
                Card {currentCardIndex + 1} of {dueCards.length}
              </span>
            )}
          </div>

          {dueCards.length === 0 ? (
            <div className="rounded-2xl border border-white/8 bg-white/4 p-8 text-center">
              <p className="text-3xl mb-2">🎉</p>
              <p className="font-semibold text-white">All caught up!</p>
              <p className="text-sm text-muted mt-1">
                No cards due for review - great job!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div
                onClick={() => setShowAnswer(!showAnswer)}
                className="cursor-pointer rounded-2xl border border-white/8 bg-white/4 p-8 text-center transition hover:border-white/20"
              >
                <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                  {currentCard.category}
                </span>
                <p className="mt-2 text-xl font-semibold">
                  {currentCard.question}
                </p>
                {showAnswer && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <p className="text-sm text-white/80">
                      {currentCard.answer}
                    </p>
                  </div>
                )}
                <p className="mt-4 text-xs text-muted">
                  Click to {showAnswer ? "hide" : "show"} answer
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handleAnswer(false)}
                  className="rounded-2xl bg-white/5 border border-white/10 px-4 py-3 font-semibold text-[#ff8a8a] transition hover:bg-white/10"
                >
                  ❌ Forgot
                </button>
                <button
                  type="button"
                  onClick={() => handleAnswer(true)}
                  className="rounded-2xl bg-[linear-gradient(135deg,#3dd598,#2cc689)] px-4 py-3 font-semibold text-slate-950"
                >
                  ✅ Got it!
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {view === "manage" && (
        <div className="mt-4 space-y-3">
          {flashcards.length === 0 && (
            <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center text-sm text-muted">
              No flashcards yet! Add some first!
            </div>
          )}
          {flashcards.map(card => (
            <div
              key={card.id}
              className="rounded-2xl border border-white/8 bg-white/4 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <span className="text-xs font-semibold rounded-full bg-white/5 border border-white/10 px-2 py-1 text-muted">
                    {card.category}
                  </span>
                  <p className="mt-2 font-semibold">{card.question}</p>
                  <p className="mt-1 text-sm text-muted">{card.answer}</p>
                  <div className="mt-2 flex gap-4 text-xs text-muted">
                    <span>Correct: {card.correctCount}</span>
                    <span>Wrong: {card.wrongCount}</span>
                    <span>Next review: {new Date(card.nextReview).toLocaleDateString()}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => deleteCard(card.id)}
                  className="text-white/60 hover:text-white"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "add" && (
        <form className="mt-4 space-y-4" onSubmit={addCard}>
          <div>
            <label className="text-sm text-muted">Question</label>
            <textarea
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter your question..."
              className="mt-2 w-full min-h-[100px] rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted">Answer</label>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Enter your answer..."
              className="mt-2 w-full min-h-[100px] rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-3 text-sm text-white outline-none"
            >
              <option value="Timing">Timing</option>
              <option value="Physical Design">Physical Design</option>
              <option value="Signoff">Signoff</option>
              <option value="Tools">Tools</option>
              <option value="Scripting">Scripting</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={!newQuestion.trim() || !newAnswer.trim()}
            className="w-full rounded-2xl bg-[linear-gradient(135deg,#69a7ff,#8f7cff)] px-4 py-3 font-semibold text-slate-950 disabled:opacity-50"
          >
            Add Flashcard
          </button>
        </form>
      )}
    </div>
  );
}
