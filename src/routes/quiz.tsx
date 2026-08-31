import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Check, ListChecks, X } from "lucide-react";
import { loadStudySet, sampleStudySet, type StudySet } from "@/lib/study-data";
import { cn } from "@/lib/utils";

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

const difficultyStyles: Record<string, string> = {
  easy: "border-success/40 text-success",
  medium: "border-accent/50 text-accent",
  hard: "border-destructive/50 text-destructive",
};

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
    const message = pct >= 80 ? "Excellent work" : pct >= 50 ? "Good effort" : "Keep practising";
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col items-center justify-center px-5 pb-10 text-center">
        {questions.length ? (
          <>
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">Your score</span>
            <div className="mt-6 grid h-36 w-36 place-items-center rounded-full border border-accent/40 bg-card">
              <div>
                <p className="text-5xl font-semibold tabular-nums text-foreground">{pct}%</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {score} of {questions.length} correct
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm font-medium text-foreground">{message}</p>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card">
              <ListChecks className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">No quiz yet</p>
              <p className="mt-1 text-xs text-muted-foreground">Paste some notes and generate a study set first.</p>
            </div>
          </div>
        )}
        <div className="mt-10 grid w-full gap-3">
          {questions.length > 0 && (
            <button
              onClick={restart}
              className="w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 active:opacity-80"
            >
              Try again
            </button>
          )}
          <Link
            to="/"
            className="w-full rounded-2xl border border-border bg-card px-5 py-4 text-sm font-medium text-foreground transition-colors hover:border-accent"
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
      <header className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
        <Link
          to="/"
          aria-label="Back to notes"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:border-accent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <span className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
          <ListChecks className="h-4 w-4 shrink-0 text-accent" />
          <span className="truncate font-medium">Quiz</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "rounded-full border bg-card px-2.5 py-1 text-[11px] font-medium capitalize",
              difficultyStyles[q.difficulty] ?? "border-border text-muted-foreground",
            )}
          >
            {q.difficulty}
          </span>
          <span className="rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
            {index + 1}/{questions.length}
          </span>
        </span>
      </header>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={index + 1}>
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <h1 className="mt-8 text-xl font-medium leading-snug text-foreground sm:text-2xl">{q.question}</h1>

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
              className={cn(
                "flex items-center justify-between gap-3 rounded-2xl border px-4 py-4 text-left text-sm transition-all",
                state === "correct"
                  ? "border-success bg-success/10 text-foreground"
                  : state === "wrong"
                    ? "border-destructive bg-destructive/10 text-foreground"
                    : "border-border bg-card text-foreground hover:border-accent",
                revealed && state === "idle" && "opacity-60",
              )}
            >
              <span className="flex min-w-0 items-center gap-3">
                <span
                  className={cn(
                    "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[11px] font-semibold",
                    state === "correct"
                      ? "border-success text-success"
                      : state === "wrong"
                        ? "border-destructive text-destructive"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {key}
                </span>
                <span className="min-w-0">{label}</span>
              </span>
              {state === "correct" && <Check className="h-4 w-4 shrink-0 text-success" />}
              {state === "wrong" && <X className="h-4 w-4 shrink-0 text-destructive" />}
            </button>
          );
        })}
      </div>

      {revealed && (
        <div
          className={cn(
            "mt-4 rounded-2xl border px-4 py-3 text-xs leading-relaxed",
            selected === q.correctAnswer
              ? "border-success/40 bg-success/10 text-foreground"
              : "border-destructive/40 bg-destructive/10 text-foreground",
          )}
        >
          <p className="font-semibold">{selected === q.correctAnswer ? "Correct" : "Not quite"}</p>
          {q.explanation && <p className="mt-1 text-muted-foreground">{q.explanation}</p>}
        </div>
      )}

      <button
        onClick={next}
        disabled={!revealed}
        className="mt-auto w-full rounded-2xl bg-accent px-5 py-4 pt-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 active:opacity-80 disabled:pointer-events-none disabled:opacity-40"
        style={{ marginTop: "auto" }}
      >
        {index === questions.length - 1 ? "See score" : "Next question"}
      </button>
    </main>
  );
}
