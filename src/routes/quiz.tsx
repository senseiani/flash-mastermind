import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, X } from "lucide-react";
import { loadStudySet, sampleStudySet, type StudySet } from "@/lib/study-data";

export const Route = createFileRoute("/quiz")({
  head: () => ({
    meta: [
      { title: "Quiz — FlashGenius" },
      {
        name: "description",
        content: "Test yourself with AI-generated multiple-choice questions and instant right or wrong feedback.",
      },
      { property: "og:title", content: "Quiz — FlashGenius" },
      { property: "og:description", content: "Multiple-choice questions with instant feedback and a final score." },
    ],
  }),
  component: QuizPage,
});

function QuizPage() {
  const [set, setSet] = useState<StudySet>(sampleStudySet);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setSet(loadStudySet());
  }, []);

  const questions = set.quiz;
  const q = questions[index];
  const progress = questions.length ? ((index + 1) / questions.length) * 100 : 0;

  const restart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  };

  const pick = (key: string) => {
    if (selected !== null || !q) return;
    setSelected(key);
    if (key === q.correctAnswer) setScore((s) => s + 1);
  };

  const next = () => {
    if (index === questions.length - 1) {
      setDone(true);
      return;
    }
    setSelected(null);
    setIndex((i) => i + 1);
  };

  if (done || !q) {
    const pct = questions.length ? Math.round((score / questions.length) * 100) : 0;
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-5 text-center">
        {questions.length ? (
          <>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Your score</span>
            <p className="mt-4 text-6xl font-semibold text-foreground">{pct}%</p>
            <p className="mt-2 text-sm text-muted-foreground">
              {score} of {questions.length} correct
            </p>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">No quiz yet — paste some notes and generate.</p>
        )}
        <div className="mt-10 grid w-full gap-3">
          {questions.length > 0 && (
            <button
              onClick={restart}
              className="w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Try again
            </button>
          )}
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

  const revealed = selected !== null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-8">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="truncate text-sm text-muted-foreground">
          Question {index + 1}/{questions.length} · {q.difficulty}
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
        {Object.entries(q.options).map(([key, label]) => {
          const isAnswer = key === q.correctAnswer;
          const isPicked = selected === key;
          const state = revealed && isAnswer ? "correct" : revealed && isPicked ? "wrong" : "idle";
          return (
            <button
              key={key}
              onClick={() => pick(key)}
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
              <span className="min-w-0">
                <span className="mr-2 text-muted-foreground">{key}</span>
                {label}
              </span>
              {state === "correct" && <Check className="h-4 w-4 shrink-0 text-success" />}
              {state === "wrong" && <X className="h-4 w-4 shrink-0 text-destructive" />}
            </button>
          );
        })}
      </div>

      {revealed && q.explanation && (
        <p className="mt-4 rounded-2xl border border-border bg-card px-4 py-3 text-xs leading-relaxed text-muted-foreground">
          {q.explanation}
        </p>
      )}

      <button
        onClick={next}
        disabled={!revealed}
        className="mt-8 w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
      >
        {index === questions.length - 1 ? "See score" : "Next question"}
      </button>
    </main>
  );
}
