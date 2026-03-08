import type { QuizQuestion } from "@/types/quiz";
import { useMemo } from "react";

export type SectionSnapshot =
  | { kind: "summary" }
  | {
      kind: "question";
      question: QuizQuestion;
      isLast: boolean;
      canProceed: boolean;
    }
  | { kind: "empty" };

type Params = {
  showSummary: boolean;
  questions: QuizQuestion[] | null;
  currentQuestion: QuizQuestion | null;
  isLast: boolean;
  isCurrentStepValid: boolean;
};

/**
 * Derives the currently visible quiz section (question, summary, or empty)
 * from quiz engine state and UI summary mode.
 */
export function useQuizSectionSnapshot({
  showSummary,
  questions,
  currentQuestion,
  isLast,
  isCurrentStepValid,
}: Params): SectionSnapshot {
  return useMemo<SectionSnapshot>(() => {
    if (showSummary && questions) {
      return { kind: "summary" };
    }
    if (currentQuestion) {
      return {
        kind: "question",
        question: currentQuestion,
        isLast,
        canProceed: isCurrentStepValid,
      };
    }
    return { kind: "empty" };
  }, [showSummary, questions, currentQuestion, isLast, isCurrentStepValid]);
}

export function getSectionKey(section: SectionSnapshot): string {
  return section.kind === "question" ? section.question.key : "empty";
}
