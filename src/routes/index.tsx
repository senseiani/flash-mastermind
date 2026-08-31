import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Layers, ListChecks } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlashGenius — Turn notes into flashcards & quizzes" },
      {
        name: "description",
        content:
          "Paste your notes and instantly study them as flip flashcards and multiple-choice quizzes. Minimal, dark, mobile-first.",
      },
      { property: "og:title", content: "FlashGenius — Turn notes into flashcards & quizzes" },
      {
        property: "og:description",
        content: "Paste notes, get flashcards and quizzes. A focused, dark, mobile-first study app.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [notes, setNotes] = useState("");
  const navigate = useNavigate();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-xl flex-col px-5 pb-16 pt-14">
      <div className="flex items-center gap-2 text-accent">
        <Sparkles className="h-5 w-5" />
        <span className="text-xs font-semibold uppercase tracking-[0.2em]">FlashGenius</span>
      </div>

      <h1 className="mt-6 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
        Paste your notes.
        <br />
        <span className="text-muted-foreground">Study them in seconds.</span>
      </h1>

      <label htmlFor="notes" className="mt-8 text-sm font-medium text-muted-foreground">
        Your notes
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Paste lecture notes, a chapter summary, or anything you need to memorise…"
        className="mt-2 min-h-52 w-full resize-y rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-accent"
      />

      <button
        onClick={() => navigate({ to: "/flashcards" })}
        className="mt-4 w-full rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 active:opacity-80"
      >
        Generate
      </button>
      <p className="mt-3 text-center text-xs text-muted-foreground">
        Demo mode — sample cards are used for now.
      </p>

      <div className="mt-10 grid gap-3">
        <Link
          to="/flashcards"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:border-accent"
        >
          <Layers className="h-5 w-5 shrink-0 text-accent" />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-foreground">Flashcards</span>
            <span className="block text-xs text-muted-foreground">10 cards · tap to flip</span>
          </span>
        </Link>
        <Link
          to="/quiz"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:border-accent"
        >
          <ListChecks className="h-5 w-5 shrink-0 text-accent" />
          <span className="min-w-0">
            <span className="block text-sm font-medium text-foreground">Quiz</span>
            <span className="block text-xs text-muted-foreground">6 questions · instant feedback</span>
          </span>
        </Link>
      </div>
    </main>
  );
}
