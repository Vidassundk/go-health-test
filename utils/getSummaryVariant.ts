import { PROGRAM_VALUES, QUIZ_KEYS } from "@/constants/quiz";
import type { QuizAnswers } from "@/stores";

export type SummaryVariant = "smoking" | "drinking";

/**
 * Determines which summary variant to show based on quiz answers.
 * Uses the program answer from API-backed program values.
 */
export function getSummaryVariant(answers: QuizAnswers): SummaryVariant {
  const program = answers[QUIZ_KEYS.program];

  if (program === PROGRAM_VALUES.quitAlcohol) {
    return "drinking";
  }

  // quit_smoking or missing -> smoking
  return "smoking";
}
