import {
  useQuizStore,
  selectCurrentIndex,
  selectSetCurrentIndex,
} from "@/stores/quizStore";
import type { QuizQuestion } from "@/types/quiz";
import {
  getEmailValidationError,
  getPasswordValidationError,
} from "@/utils/validation";
import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import type { QuizAnswers } from "@/stores/quizStore";

export type { QuizAnswers } from "@/stores/quizStore";

/**
 * Keep only answers that control visibility (visibleIf.question keys).
 * This lets the visibility computation ignore unrelated answer changes.
 */
function pickAnswersByKeys(
  answers: QuizAnswers,
  keys: Set<string>
): Partial<QuizAnswers> {
  if (keys.size === 0) {
    return {};
  }
  return Object.fromEntries(
    Object.entries(answers).filter(([key]) => keys.has(key))
  );
}

/** Normalize unknown store values into comparable string form. */
function toComparableAnswerValue(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  return String(value);
}

/**
 * We only treat this as a branch change when both values exist and differ.
 * (null/undefined -> something does not clear previous branch answers)
 */
function didAnswerValueChange(previous: unknown, next: unknown): boolean {
  const previousValue = toComparableAnswerValue(previous);
  const nextValue = toComparableAnswerValue(next);
  return previousValue !== null && nextValue !== null && previousValue !== nextValue;
}

function isVisible(question: QuizQuestion, answers: QuizAnswers): boolean {
  const condition = question.visibleIf;
  if (!condition) return true;

  const answer = answers[condition.question];
  if (answer === undefined || answer === null) return false;

  if (Array.isArray(answer)) {
    return answer.includes(condition.value);
  }
  return String(answer) === condition.value;
}

function getVisibleQuestions(
  questions: QuizQuestion[],
  answers: QuizAnswers
): QuizQuestion[] {
  return questions.filter((q) => isVisible(q, answers));
}

function isStepValid(question: QuizQuestion, value: unknown): boolean {
  if (value === undefined || value === null || value === "") {
    return false;
  }

  switch (question.type) {
    case "weight": {
      const n = Number(value);
      return !isNaN(n) && n >= 44 && n <= 1100;
    }
    case "age": {
      const n = Number(value);
      return !isNaN(n) && n >= 1 && n <= 120;
    }
    case "credentials": {
      const v = value as { email?: string; password?: string };
      return (
        !getEmailValidationError(v?.email) && !getPasswordValidationError(v?.password)
      );
    }
    case "single":
      return !!(value && (typeof value !== "string" || value.trim()));
    case "multiple":
      return Array.isArray(value) && value.length > 0;
    default:
      return true;
  }
}

type UseQuizEngineOptions = {
  onSubmit?: (answers: QuizAnswers) => void;
};

/** Keys from answers that affect question visibility (visibleIf conditions) */
function getVisibilityKeys(questions: QuizQuestion[] | null): Set<string> {
  if (!questions) return new Set();
  return new Set(
    questions.flatMap((q) => (q.visibleIf ? [q.visibleIf.question] : []))
  );
}

/** Keys controlled by a visibility condition branch; cleared when branch selection changes */
function getDependentQuestionKeysForVisibilityValue(
  questions: QuizQuestion[],
  visibilityKey: string,
  value: string
): string[] {
  return questions
    .filter(
      (q) =>
        q.visibleIf?.question === visibilityKey && q.visibleIf?.value === value
    )
    .map((q) => q.key);
}

/**
 * Central quiz flow controller:
 * - computes visible steps from answers
 * - validates current step
 * - handles forward/backward navigation
 * - triggers submit with full answer snapshot
 */
export function useQuizEngine(
  questions: QuizQuestion[] | null,
  options?: UseQuizEngineOptions
) {
  const { onSubmit } = options ?? {};

  const visibilityKeys = useMemo(() => getVisibilityKeys(questions), [questions]);
  const visibilitySlice = useQuizStore(
    useShallow((s) => pickAnswersByKeys(s.answers, visibilityKeys))
  );

  const currentIndex = useQuizStore(selectCurrentIndex);
  const storeSetAnswer = useQuizStore((s) => s.setAnswer);
  const clearAnswers = useQuizStore((s) => s.clearAnswers);
  const setCurrentIndex = useQuizStore(selectSetCurrentIndex);

  // When a visibility-controller answer changes, clear answers from the branch being left.
  const setAnswer = useCallback(
    (key: string, value: unknown) => {
      if (questions && visibilityKeys.has(key)) {
        const previousValue = useQuizStore.getState().answers[key];
        if (didAnswerValueChange(previousValue, value)) {
          // Example:
          // program: quit_smoking -> quit_alcohol
          // clear answers that belonged to the old branch (quit_smoking).
          const keysToClear = getDependentQuestionKeysForVisibilityValue(
            questions,
            key,
            String(previousValue)
          );
          if (keysToClear.length > 0) {
            clearAnswers(keysToClear);
          }
        }
      }
      storeSetAnswer(key, value);
    },
    [questions, visibilityKeys, storeSetAnswer, clearAnswers]
  );

  const visibleQuestions = useMemo(
    () =>
      questions ? getVisibleQuestions(questions, visibilitySlice) : [],
    [questions, visibilitySlice]
  );

  const currentQuestion = visibleQuestions[currentIndex] ?? null;
  const totalSteps = visibleQuestions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1 && totalSteps > 0;

  const currentValue = useQuizStore((s) =>
    currentQuestion ? s.answers[currentQuestion.key] : undefined
  );
  const isCurrentStepValid = useMemo(
    () =>
      currentQuestion ? isStepValid(currentQuestion, currentValue) : true,
    [currentQuestion, currentValue]
  );

  const goNext = useCallback(() => {
    if (!currentQuestion || !isCurrentStepValid) return;

    if (isLast) {
      onSubmit?.(useQuizStore.getState().answers);
      return;
    }

    setCurrentIndex((i) => Math.min(i + 1, visibleQuestions.length - 1));
  }, [
    currentQuestion,
    isCurrentStepValid,
    isLast,
    visibleQuestions.length,
    onSubmit,
    setCurrentIndex,
  ]);

  const goBack = useCallback(() => {
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, [setCurrentIndex]);

  useEffect(() => {
    setCurrentIndex((i) =>
      Math.min(Math.max(0, i), Math.max(0, visibleQuestions.length - 1))
    );
  }, [visibleQuestions.length, setCurrentIndex]);

  return useMemo(
    () => ({
      setAnswer,
      visibleQuestions,
      currentQuestion,
      currentIndex,
      totalSteps,
      isFirst,
      isLast,
      goNext,
      goBack,
      isCurrentStepValid,
    }),
    [
      setAnswer,
      visibleQuestions,
      currentQuestion,
      currentIndex,
      totalSteps,
      isFirst,
      isLast,
      goNext,
      goBack,
      isCurrentStepValid,
    ]
  );
}
