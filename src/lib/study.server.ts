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
Hard rules:
- EXACTLY 10 flashcards and EXACTLY 5 quiz questions. Never fewer, never more.
- Every quiz question has EXACTLY 4 options keyed A, B, C, D, all distinct, and EXACTLY one correct answer.
- "difficulty" must be one of easy | medium | hard for every question.
- ids sequential: fc_1..fc_10 and q_1..q_5.
- Use ONLY information contained in the user's notes. Do not invent facts or add outside knowledge.
- Put any issues (notes too short, off-topic, ambiguous) as short strings in "warnings".`;

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

export const REQUIRED_FLASHCARDS = 10;
export const REQUIRED_QUIZ = 5;
const OPTION_KEYS = ["A", "B", "C", "D"] as const;

function normalize(raw: unknown): StudySet {
  const value = (raw ?? {}) as Partial<StudySet>;
  const flashcards = (value.flashcards ?? [])
    .filter((c) => c && typeof c.question === "string" && c.question.trim() && typeof c.answer === "string" && c.answer.trim())
    .slice(0, REQUIRED_FLASHCARDS)
    .map((c, i) => ({ id: `fc_${i + 1}`, question: c.question, answer: c.answer }));

  const quiz = (value.quiz ?? [])
    .filter((q) => {
      if (!q || typeof q.question !== "string" || !q.question.trim()) return false;
      if (!q.options || typeof q.options !== "object") return false;
      const keys = Object.keys(q.options);
      if (keys.length !== OPTION_KEYS.length) return false;
      if (!OPTION_KEYS.every((k) => typeof q.options[k] === "string" && q.options[k]!.trim())) return false;
      return typeof q.correctAnswer === "string" && (OPTION_KEYS as readonly string[]).includes(q.correctAnswer);
    })
    .slice(0, REQUIRED_QUIZ)
    .map((q, i) => ({
      id: `q_${i + 1}`,
      difficulty: (["easy", "medium", "hard"] as const).includes(q.difficulty) ? q.difficulty : "medium",
      question: q.question,
      options: {
        A: q.options["A"]!,
        B: q.options["B"]!,
        C: q.options["C"]!,
        D: q.options["D"]!,
      },
      correctAnswer: q.correctAnswer,
      explanation: typeof q.explanation === "string" ? q.explanation : "",
    }));

  const warnings = Array.isArray(value.warnings)
    ? value.warnings.filter((w): w is string => typeof w === "string")
    : [];

  if (flashcards.length !== REQUIRED_FLASHCARDS || quiz.length !== REQUIRED_QUIZ) {
    throw new Error(
      `The AI returned ${flashcards.length} valid flashcards and ${quiz.length} valid quiz questions — ${REQUIRED_FLASHCARDS} flashcards and ${REQUIRED_QUIZ} questions are required. Try again with more detailed notes.`,
    );
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
