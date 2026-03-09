import { useQuizStore, selectCurrentIndex, selectSetCurrentIndex } from "@/stores";
import type { QuizQuestion } from "@/types/quiz";
import {
  didAnswerValueChange,
  getDependentQuestionKeysForVisibilityValue,
  getVisibleQuestions,
  getVisibilityKeys,
  isStepValid,
  pickAnswersByKeys,
} from "@/utils/quizEngineCore";
import { useCallback, useEffect, useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import type { QuizAnswers } from "@/stores";

export type { QuizAnswers } from "@/stores";

type UseQuizEngineOptions = {
  onSubmit?: (answers: QuizAnswers) => void;
};

/**
 * Central quiz flow controller:
 * - computes visible steps from answers
 * - validates current step
 * - handles forward/backward navigation
 * - triggers submit with full answer snapshot
 */
export function useQuizEngine(questions: QuizQuestion[] | null, options?: UseQuizEngineOptions) {
  const { onSubmit } = options ?? {};

  // Precompute which answer keys can change visibility to avoid broad subscriptions.
  const visibilityKeys = useMemo(() => getVisibilityKeys(questions), [questions]);
  // Subscribe only to visibility-driving answers for cheaper recomputation.
  const visibilitySlice = useQuizStore(
    useShallow((s) => pickAnswersByKeys(s.answers, visibilityKeys))
  );

  // Cursor/state controls from the store.
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
    () => (questions ? getVisibleQuestions(questions, visibilitySlice) : []),
    [questions, visibilitySlice]
  );

  // Derived step state used by the UI.
  const currentQuestion = visibleQuestions[currentIndex] ?? null;
  const totalSteps = visibleQuestions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1 && totalSteps > 0;

  // Answer value for the currently visible question.
  const currentValue = useQuizStore((s) =>
    currentQuestion ? s.answers[currentQuestion.key] : undefined
  );
  // Validation gates "next" and "submit".
  const isCurrentStepValid = useMemo(
    () => (currentQuestion ? isStepValid(currentQuestion, currentValue) : true),
    [currentQuestion, currentValue]
  );

  // Advance one visible step, or submit on the last valid step.
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

  // Keep index in bounds whenever visibility changes the step count.
  useEffect(() => {
    setCurrentIndex((i) => Math.min(Math.max(0, i), Math.max(0, visibleQuestions.length - 1)));
  }, [visibleQuestions.length, setCurrentIndex]);

  // Stable API surface consumed by quiz screens/components.
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
