import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { quizQuestions } from "@/lib/study-data";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — FlashGenius" },
      { name: "description", content: "Test yourself with multiple-choice questions and instant right or wrong feedback." },
      { property: "og:title", content: "Quiz — FlashGenius" },
      { property: "og:description", content: "Multiple-choice questions with instant feedback and a final score." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  const q = quizQuestions[index];
  const progress = ((index + 1) / quizQuestions.length) * 100;

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  const pick = (i: number) => {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answerIndex) setScore((s) => s + 1);
  };

  const next = () => {
    if (index === quizQuestions.length - 1) {
      setDone(true);
      return;
    }
    setSelected(null);
    setIndex((i) => i + 1);
  };

  if (done) {
    const pct = Math.round((score / quizQuestions.length) * 100);
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-5 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Your score</span>
        <p className="mt-4 text-6xl font-semibold text-foreground">{pct}%</p>
        <p className="mt-2 text-sm text-muted-foreground">
          {score} of {quizQuestions.length} correct
        </p>
        <div className="mt-10 grid w-full gap-3">
          <button
            onClick={restart}
            className="w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            to="/"
            className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm font-medium text-foreground"
          >
            Back to notes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-8">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="truncate text-sm text-muted-foreground">
          Question {index + 1} of {quizQuestions.length}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h1 className="mt-8 text-2xl font-medium leading-snug text-foreground">{q.question}</h1>

      <div className="mt-6 grid gap-3">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answerIndex;
          const isPicked = selected === i;
          const revealed = selected !== null;
          const state = revealed && isAnswer ? "correct" : revealed && isPicked ? "wrong" : "idle";
          return (
            <button
              key={opt}
              onClick={() => pick(i)}
              disabled={revealed}
              className={[
                "flex items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left text-sm transition-colors",
                state === "correct"
                  ? "border-success bg-success/10 text-foreground"
                  : state === "wrong"
                    ? "border-destructive bg-destructive/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-accent",
              ].join(" ")}
            >
              <span className="min-w-0">{opt}</span>
              {state === "correct" && <Check className="h-4 w-4 shrink-0 text-success" />}
              {state === "wrong" && <X className="h-4 w-4 shrink-0 text-destructive" />}
            </button>
          );
        })}
      </div>

      <button
        onClick={next}
        disabled={selected === null}
        className="mt-8 w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {index === quizQuestions.length - 1 ? "See score" : "Next question"}
      </button>
    </main>
  );
}
