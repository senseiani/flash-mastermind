import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import { flashcards } from "@/lib/study-data";

export const Route = createFileRoute("/flashcards")({
  head: () => ({
    meta: [
      { title: "Flashcards — FlashGenius" },
      { name: "description", content: "Flip through your generated flashcards and track progress as you study." },
      { property: "og:title", content: "Flashcards — FlashGenius" },
      { property: "og:description", content: "Flip through generated flashcards and track your study progress." },
    ],
  }),
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const card = flashcards[index]!;
  const progress = ((index + 1) / flashcards.length) * 100;

  const go = (delta: number) => {
    setFlipped(false);
    setIndex((i) => Math.min(flashcards.length - 1, Math.max(0, i + delta)));
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-10 pt-8">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <Link to="/" className="text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <span className="truncate text-sm text-muted-foreground">
          Card {index + 1} of {flashcards.length}
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="group mt-8 min-h-72 w-full flex-1 rounded-3xl border border-border bg-card p-6 text-left transition-colors hover:border-accent"
        aria-label="Flip card"
      >
        <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-accent">
          {flipped ? "Answer" : "Question"}
        </span>
        <p className="mt-6 text-2xl font-medium leading-snug text-foreground">
          {flipped ? card.back : card.front}
        </p>
        <span className="mt-6 inline-flex items-center gap-2 text-xs text-muted-foreground">
          <RotateCw className="h-3.5 w-3.5" /> Tap to flip
        </span>
      </button>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          onClick={() => go(-1)}
          disabled={index === 0}
          className="rounded-2xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-opacity disabled:opacity-40"
        >
          Previous
        </button>
        {index === flashcards.length - 1 ? (
          <Link
            to="/quiz"
            className="flex items-center justify-center gap-2 rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground"
          >
            Start quiz <ArrowRight className="h-4 w-4" />
          </Link>
        ) : (
          <button
            onClick={() => go(1)}
            className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
          >
            Next
          </button>
        )}
      </div>
    </main>
  );
}
