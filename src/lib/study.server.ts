import { streamText } from "ai";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";
import type { StudySet } from "./study-data";

const SYSTEM_PROMPT = `You turn study notes into flashcards and a multiple-choice quiz.
Reply with ONLY raw JSON (no markdown fences) in exactly this shape:
{
  "flashcards": [{ "id": "fc_1", "question": "...", "answer": "..." }],
  "quiz": [{
    "id": "q_1",
    "difficulty": "easy",
    "question": "...",
    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "correctAnswer": "B",
    "explanation": "..."
  }],
  "warnings": []
}
Rules: 8-12 flashcards and 5-8 quiz questions when the notes allow it; ids sequential (fc_1, q_1, ...);
difficulty is one of easy | medium | hard; correctAnswer is one of A, B, C, D;
put any issues (notes too short, off-topic, ambiguous) as short strings in "warnings".`;

function extractJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start === -1 || end <= start) throw new Error("Model did not return JSON");
    return JSON.parse(cleaned.slice(start, end + 1));
  }
}

function normalize(raw: unknown): StudySet {
  const value = (raw ?? {}) as Partial<StudySet>;
  const flashcards = (value.flashcards ?? [])
    .filter((c) => c && typeof c.question === "string" && typeof c.answer === "string")
    .map((c, i) => ({ id: c.id ?? `fc_${i + 1}`, question: c.question, answer: c.answer }));

  const quiz = (value.quiz ?? [])
    .filter(
      (q) =>
        q &&
        typeof q.question === "string" &&
        q.options &&
        typeof q.options === "object" &&
        typeof q.correctAnswer === "string" &&
        q.options[q.correctAnswer] !== undefined,
    )
    .map((q, i) => ({
      id: q.id ?? `q_${i + 1}`,
      difficulty: (["easy", "medium", "hard"] as const).includes(q.difficulty) ? q.difficulty : "medium",
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: typeof q.explanation === "string" ? q.explanation : "",
    }));

  const warnings = Array.isArray(value.warnings)
    ? value.warnings.filter((w): w is string => typeof w === "string")
    : [];

  if (!flashcards.length && !quiz.length) {
    throw new Error("The AI could not build study material from those notes.");
  }

  return { flashcards, quiz, warnings };
}

export async function buildStudySet(notes: string): Promise<StudySet> {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const gateway = createLovableAiGatewayProvider(key);
  const result = streamText({
    model: gateway("google/gemini-3.7-flash"),
    system: SYSTEM_PROMPT,
    prompt: `Notes:\n\n${notes.slice(0, 20000)}`,
  });

  const text = await result.text;
  return normalize(extractJson(text));
}
