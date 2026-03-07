import type { QuizAnswers } from "@/hooks/useQuizEngine";

export type SummaryVariant = "smoking" | "drinking";

/**
 * Determines which summary variant to show based on quiz answers.
 * Uses the "program" question (quit_smoking | quit_alcohol) from the API.
 */
export function getSummaryVariant(answers: QuizAnswers): SummaryVariant {
  const program = answers["program"];

  if (program === "quit_alcohol") {
    return "drinking";
  }

  // quit_smoking or missing → smoking
  return "smoking";
}
