import type { QuizAnswers } from "@/stores/quizStore";
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
  const nameQuestion = questions.find((q) => q.type === "name" || q.key === "name");
  const name = nameQuestion
    ? String(answers[nameQuestion.key] ?? "").trim()
    : "";

  const programQuestion = questions.find((q) => q.key === "program");
  const programValue = programQuestion
    ? (answers[programQuestion.key] as string | undefined)
    : undefined;
  const mainGoal =
    programQuestion && programValue
      ? getOptionTitle(programQuestion, programValue)
      : "";

  const complementaryGoals: string[] = [];
  const multipleQuestions = questions.filter(
    (q) => q.type === "multiple" && q.key !== "program"
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
    mainGoal: mainGoal || "Improve my health",
    complementaryGoals,
  };
}
