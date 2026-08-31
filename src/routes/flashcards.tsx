import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Layers, RotateCw } from "lucide-react";
import { loadStudySet, sampleStudySet, type StudySet } from "@/lib/study-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Flashcards — FlashGenius" },
      { name: "description", content: "Flip through your AI-generated flashcards and track progress as you study." },
      { property: "og:title", content: "Flashcards — FlashGenius" },
      { property: "og:description", content: "Flip through AI-generated flashcards and track your study progress." },
    ],
  }),
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const [set, setSet] = useState<StudySet>(sampleStudySet);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    setSet(loadStudySet());
    setIndex(0);
    setFlipped(false);
  }, []);

  const cards = set.flashcards;
  const card = cards[index];
  const progress = cards.length ? ((index + 1) / cards.length) * 100 : 0;

  const go = (delta: number) => {
    setFlipped(false);
    setIndex((i) => Math.min(cards.length - 1, Math.max(0, i + delta)));
  };

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
          <Layers className="h-4 w-4 shrink-0 text-accent" />
          <span className="truncate font-medium">Flashcards</span>
        </span>
        <span className="shrink-0 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium tabular-nums text-muted-foreground">
          {Math.min(index + 1, cards.length)}/{cards.length}
        </span>
      </header>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuemin={0} aria-valuemax={cards.length} aria-valuenow={Math.min(index + 1, cards.length)}>
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {card ? (
        <>
          <button
            onClick={() => setFlipped((f) => !f)}
            className="flip-scene mt-8 min-h-80 w-full flex-1 text-left outline-none"
            aria-label={flipped ? "Show question" : "Show answer"}
          >
            <div className={cn("flip-inner", flipped && "is-flipped")}>
              <div className="flip-face flex flex-col rounded-3xl border border-border bg-card p-6 shadow-sm transition-colors hover:border-accent sm:p-8">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Question
                </span>
                <p className="mt-6 flex-1 text-xl font-medium leading-snug text-foreground sm:text-2xl">
                  {card.question}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <RotateCw className="h-3.5 w-3.5" /> Tap to flip
                </span>
              </div>
              <div className="flip-face flip-back flex flex-col rounded-3xl border border-accent/50 bg-card p-6 shadow-sm sm:p-8">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
                  Answer
                </span>
                <p className="mt-6 flex-1 text-xl font-medium leading-snug text-foreground sm:text-2xl">
                  {card.answer}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
                  <RotateCw className="h-3.5 w-3.5" /> Tap to flip back
                </span>
              </div>
            </div>
          </button>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button
              onClick={() => go(-1)}
              disabled={index === 0}
              className="rounded-2xl border border-border bg-card px-4 py-3.5 text-sm font-medium text-foreground transition-all hover:border-accent disabled:pointer-events-none disabled:opacity-40"
            >
              Previous
            </button>
            {index === cards.length - 1 ? (
              <Link
                to="/quiz"
                className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 active:opacity-80"
              >
                Start quiz <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <button
                onClick={() => go(1)}
                className="rounded-2xl bg-accent px-4 py-3.5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 active:opacity-80"
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="mt-16 flex flex-1 flex-col items-center justify-center gap-4 text-center">
          <div className="grid h-14 w-14 place-items-center rounded-2xl border border-border bg-card">
            <Layers className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">No flashcards yet</p>
            <p className="mt-1 text-xs text-muted-foreground">Paste some notes and generate a study set first.</p>
          </div>
          <Link
            to="/"
            className="mt-2 rounded-2xl bg-accent px-5 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Back to notes
          </Link>
        </div>
      )}
    </main>
  );
}
