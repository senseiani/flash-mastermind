import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { Sparkles, Layers, ListChecks, Loader2, AlertTriangle, ArrowRight } from "lucide-react";
import { generateStudySet } from "@/lib/study.functions";
import { saveStudySet } from "@/lib/study-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FlashGenius — Turn notes into flashcards & quizzes" },
      {
        name: "description",
        content:
          "Paste your notes and instantly get AI-generated flip flashcards and multiple-choice quizzes. Minimal, dark, mobile-first.",
      },
      { property: "og:title", content: "FlashGenius — Turn notes into flashcards & quizzes" },
      {
        property: "og:description",
        content: "Paste notes, get AI flashcards and quizzes. A focused, dark, mobile-first study app.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const generate = useServerFn(generateStudySet);

  const onGenerate = async () => {
    setError(null);
    if (notes.trim().length < 20) {
      setError("Add a bit more text — at least a couple of sentences.");
      return;
    }
    setLoading(true);
    try {
      const set = await generate({ data: { notes: notes.trim() } });
      saveStudySet(set);
      navigate({ to: "/flashcards" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong generating your study set. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        FlashGenius turns your notes into 10 flip flashcards and a 5-question quiz — using only what's in your text.
      </p>

      <label htmlFor="notes" className="mt-8 text-sm font-medium text-muted-foreground">
        Your notes
      </label>
      <textarea
        id="notes"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        disabled={loading}
        placeholder="Paste lecture notes, a chapter summary, or anything you need to memorise…"
        className="mt-2 min-h-52 w-full resize-y rounded-2xl border border-border bg-card p-4 text-sm leading-relaxed text-foreground outline-none transition-all placeholder:text-muted-foreground/70 hover:border-muted-foreground/40 focus:border-accent focus:ring-2 focus:ring-accent/20 disabled:opacity-60"
      />

      <button
        onClick={onGenerate}
        disabled={loading}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-accent px-5 py-4 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90 active:opacity-80 disabled:pointer-events-none disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating your study set…
          </>
        ) : (
          <>
            Generate
            <Sparkles className="h-4 w-4" />
          </>
        )}
      </button>

      {loading && (
        <p className="mt-3 text-center text-xs text-muted-foreground" aria-live="polite">
          Writing 10 flashcards and 5 quiz questions — this takes a few seconds.
        </p>
      )}

      {error && (
        <p className="mt-3 flex items-start gap-2 rounded-2xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-xs leading-relaxed text-foreground" role="alert">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
          <span className="min-w-0">{error}</span>
        </p>
      )}

      {!loading && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Cards and quiz are written by AI from your notes.
        </p>
      )}

      <div className="mt-10 grid gap-3">
        <Link
          to="/flashcards"
          className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:border-accent"
        >
          <Layers className="h-5 w-5 shrink-0 text-accent" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-foreground">Flashcards</span>
            <span className="block text-xs text-muted-foreground">Tap a card to flip</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
        </Link>
        <Link
          to="/quiz"
          className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:border-accent"
        >
          <ListChecks className="h-5 w-5 shrink-0 text-accent" />
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-foreground">Quiz</span>
            <span className="block text-xs text-muted-foreground">Instant feedback + score</span>
          </span>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
        </Link>
      </div>
    </main>
  );
}
