import { useQuizStore } from "@/stores/quizStore";
import type { QuizQuestion } from "@/types/quiz";
import { useCallback, useEffect, useMemo } from "react";

import type { QuizAnswers } from "@/stores/quizStore";

export type { QuizAnswers } from "@/stores/quizStore";

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
        !!v?.email?.trim() &&
        !!v?.password &&
        String(v.password).length >= 6
      );
    }
    case "single":
      return !!(value && (typeof value !== "string" || value.trim()));
    case "multiple":
      return true;
    default:
      return true;
  }
}

type UseQuizEngineOptions = {
  onSubmit?: (answers: QuizAnswers) => void;
};

export function useQuizEngine(
  questions: QuizQuestion[] | null,
  options?: UseQuizEngineOptions
) {
  const { onSubmit } = options ?? {};
  const answers = useQuizStore((s) => s.answers);
  const currentIndex = useQuizStore((s) => s.currentIndex);
  const setAnswer = useQuizStore((s) => s.setAnswer);
  const setCurrentIndex = useQuizStore((s) => s.setCurrentIndex);

  const visibleQuestions = useMemo(() => {
    if (!questions) return [];
    return getVisibleQuestions(questions, answers);
  }, [questions, answers]);

  const currentQuestion = visibleQuestions[currentIndex] ?? null;
  const totalSteps = visibleQuestions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1 && totalSteps > 0;

  const isCurrentStepValid = useMemo(() => {
    if (!currentQuestion) return true;
    const value = answers[currentQuestion.key];
    return isStepValid(currentQuestion, value);
  }, [currentQuestion, answers]);

  const goNext = useCallback(() => {
    if (!currentQuestion || !isCurrentStepValid) return;

    if (isLast) {
      onSubmit?.(answers);
      return;
    }

    setCurrentIndex((i) => Math.min(i + 1, visibleQuestions.length - 1));
  }, [
    currentQuestion,
    isCurrentStepValid,
    answers,
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

  return {
    answers,
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
  };
}
