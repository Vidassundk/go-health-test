import { QUIZ_KEYS } from "@/constants/quiz";
import type { QuizAnswers } from "@/stores";
import type { QuizQuestion } from "@/types/quiz";

export interface SummaryDisplayData {
  name: string;
  mainGoal: string;
  complementaryGoals: string[];
}

function getOptionTitle(question: QuizQuestion, value: string): string {
  const option = question.options?.find((o) => o.value === value);
  return option?.title ?? value;
}

export function getSummaryDisplayData(
  answers: QuizAnswers,
  questions: QuizQuestion[]
): SummaryDisplayData {
  const nameQuestion = questions.find(
    (q) => q.type === "name" || q.key === QUIZ_KEYS.name
  );
  const name = nameQuestion
    ? String(answers[nameQuestion.key] ?? "").trim()
    : "";

  // Goal question from quiz
  const goalQuestion = questions.find((q) => q.key === QUIZ_KEYS.goal);
  // User's selected value (e.g. "more_control")
  const goalValue = goalQuestion
    ? (answers[goalQuestion.key] as string | undefined)
    : undefined;
  // Resolve to option title for display, fallback if none selected
  const mainGoal =
    goalQuestion && goalValue
      ? getOptionTitle(goalQuestion, goalValue)
      : "Improve my health";

  const programQuestion = questions.find((q) => q.key === QUIZ_KEYS.program);
  const programValue = programQuestion
    ? (answers[programQuestion.key] as string | undefined)
    : undefined;

  const complementaryGoals: string[] = [];
  if (programQuestion && programValue) {
    complementaryGoals.push(getOptionTitle(programQuestion, programValue));
  }
  const multipleQuestions = questions.filter(
    (q) => q.type === "multiple" && q.key !== QUIZ_KEYS.program
  );
  for (const q of multipleQuestions) {
    const value = answers[q.key];
    if (Array.isArray(value)) {
      for (const v of value) {
        if (typeof v === "string") {
          complementaryGoals.push(getOptionTitle(q, v));
        }
      }
    }
  }

  return {
    name: name || "there",
    mainGoal,
    complementaryGoals,
  };
}
