export type Flashcard = { id: number; front: string; back: string };

export type QuizQuestion = {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
};

export const flashcards: Flashcard[] = [
  { id: 1, front: "What is mitosis?", back: "Cell division producing two genetically identical daughter cells." },
  { id: 2, front: "Define entropy", back: "A measure of disorder or unavailable energy in a closed system." },
  { id: 3, front: "What is Big-O notation?", back: "A way to describe how an algorithm's cost grows with input size." },
  { id: 4, front: "Who wrote 'The Republic'?", back: "Plato, around 375 BCE." },
  { id: 5, front: "What is a mole (chemistry)?", back: "6.022 x 10^23 particles — Avogadro's number." },
  { id: 6, front: "Define opportunity cost", back: "The value of the next-best alternative you gave up." },
  { id: 7, front: "What does DNS do?", back: "Translates human-readable domain names into IP addresses." },
  { id: 8, front: "State Newton's 2nd law", back: "Force equals mass times acceleration (F = ma)." },
  { id: 9, front: "What is photosynthesis?", back: "Plants converting light, CO2 and water into glucose and oxygen." },
  { id: 10, front: "Define inflation", back: "A sustained rise in the general price level, reducing purchasing power." },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Mitosis produces how many daughter cells?",
    options: ["One", "Two", "Four", "Eight"],
    answerIndex: 1,
  },
  {
    id: 2,
    question: "Entropy is best described as a measure of…",
    options: ["Temperature", "Pressure", "Disorder", "Mass"],
    answerIndex: 2,
  },
  {
    id: 3,
    question: "Big-O notation describes…",
    options: [
      "Exact runtime in seconds",
      "Growth of cost with input size",
      "Memory chip layout",
      "Compiler warnings",
    ],
    answerIndex: 1,
  },
  {
    id: 4,
    question: "Who wrote 'The Republic'?",
    options: ["Aristotle", "Socrates", "Plato", "Homer"],
    answerIndex: 2,
  },
  {
    id: 5,
    question: "Avogadro's number is approximately…",
    options: ["3.14 x 10^8", "6.022 x 10^23", "9.81 x 10^2", "1.6 x 10^-19"],
    answerIndex: 1,
  },
  {
    id: 6,
    question: "Newton's second law states that…",
    options: ["F = ma", "E = mc^2", "PV = nRT", "a^2 + b^2 = c^2"],
    answerIndex: 0,
  },
];
