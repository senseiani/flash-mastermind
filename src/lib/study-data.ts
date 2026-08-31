export type Flashcard = {
  id: string;
  question: string;
  answer: string;
};

export type QuizQuestion = {
  id: string;
  difficulty: "easy" | "medium" | "hard";
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation: string;
};

export type StudySet = {
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  warnings: string[];
};

export const sampleStudySet: StudySet = {
  flashcards: [
    {
      id: "fc_1",
      question: "What is the powerhouse of the cell?",
      answer: "The mitochondria, because it generates ATP through cellular respiration.",
    },
    { id: "fc_2", question: "What is mitosis?", answer: "Cell division producing two genetically identical daughter cells." },
    { id: "fc_3", question: "Define entropy", answer: "A measure of disorder or unavailable energy in a closed system." },
    { id: "fc_4", question: "What is Big-O notation?", answer: "A way to describe how an algorithm's cost grows with input size." },
    { id: "fc_5", question: "What is photosynthesis?", answer: "Plants converting light, CO2 and water into glucose and oxygen." },
    { id: "fc_6", question: "State Newton's 2nd law", answer: "Force equals mass times acceleration (F = ma)." },
  ],
  quiz: [
    {
      id: "q_1",
      difficulty: "easy",
      question: "Which organelle produces ATP?",
      options: { A: "Nucleus", B: "Mitochondria", C: "Ribosome", D: "Golgi apparatus" },
      correctAnswer: "B",
      explanation: "Mitochondria carry out cellular respiration, which produces ATP.",
    },
    {
      id: "q_2",
      difficulty: "easy",
      question: "Mitosis produces how many daughter cells?",
      options: { A: "One", B: "Two", C: "Four", D: "Eight" },
      correctAnswer: "B",
      explanation: "Mitosis splits one cell into two identical daughter cells.",
    },
    {
      id: "q_3",
      difficulty: "medium",
      question: "Entropy is best described as a measure of…",
      options: { A: "Temperature", B: "Pressure", C: "Disorder", D: "Mass" },
      correctAnswer: "C",
      explanation: "Entropy quantifies disorder or unavailable energy in a system.",
    },
    {
      id: "q_4",
      difficulty: "medium",
      question: "Big-O notation describes…",
      options: {
        A: "Exact runtime in seconds",
        B: "Growth of cost with input size",
        C: "Memory chip layout",
        D: "Compiler warnings",
      },
      correctAnswer: "B",
      explanation: "Big-O expresses how cost scales as input grows.",
    },
  ],
  warnings: [],
};

const STORAGE_KEY = "flashgenius:study-set";

export function saveStudySet(set: StudySet) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(set));
}

export function loadStudySet(): StudySet {
  if (typeof window === "undefined") return sampleStudySet;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return sampleStudySet;
    const parsed = JSON.parse(raw) as StudySet;
    if (!parsed?.flashcards?.length && !parsed?.quiz?.length) return sampleStudySet;
    return {
      flashcards: parsed.flashcards ?? [],
      quiz: parsed.quiz ?? [],
      warnings: parsed.warnings ?? [],
    };
  } catch {
    return sampleStudySet;
  }
}
