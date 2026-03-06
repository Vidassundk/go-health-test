import type { QuizQuestion } from "@/types/quiz";
import { useCallback, useEffect, useMemo, useState } from "react";

export type QuizAnswers = Record<string, unknown>;

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

function validateQuestion(
  question: QuizQuestion,
  value: unknown
): string | null {
  if (value === undefined || value === null || value === "") {
    return "This field is required";
  }

  switch (question.type) {
    case "weight": {
      const n = Number(value);
      if (isNaN(n) || n < 20 || n > 500) return "Please enter a valid weight";
      return null;
    }
    case "age": {
      const n = Number(value);
      if (isNaN(n) || n < 1 || n > 120) return "Please enter a valid age";
      return null;
    }
    case "credentials": {
      const v = value as { email?: string; password?: string };
      if (!v?.email?.trim()) return "Email is required";
      if (!v?.password || String(v.password).length < 6)
        return "Password must be at least 6 characters";
      return null;
    }
    case "single":
      if (!value || (typeof value === "string" && !value.trim()))
        return "Please select an option";
      return null;
    case "multiple":
      return null;
    default:
      return null;
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
  const [answers, setAnswersState] = useState<QuizAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [validationError, setValidationError] = useState<string | null>(null);

  const visibleQuestions = useMemo(() => {
    if (!questions) return [];
    return getVisibleQuestions(questions, answers);
  }, [questions, answers]);

  const currentQuestion = visibleQuestions[currentIndex] ?? null;
  const totalSteps = visibleQuestions.length;
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === totalSteps - 1 && totalSteps > 0;

  const setAnswer = useCallback(
    (key: string, value: unknown) => {
      setAnswersState((prev) => ({ ...prev, [key]: value }));
      setValidationError(null);
    },
    []
  );

  const validateCurrent = useCallback((): string | null => {
    if (!currentQuestion) return null;
    const value = answers[currentQuestion.key];
    return validateQuestion(currentQuestion, value);
  }, [currentQuestion, answers]);

  const isCurrentStepValid = useMemo(() => {
    return validateCurrent() === null;
  }, [validateCurrent]);

  const goNext = useCallback(() => {
    if (!currentQuestion) return;

    const value = answers[currentQuestion.key];
    const error = validateQuestion(currentQuestion, value);

    if (error) {
      setValidationError(error);
      return;
    }

    setValidationError(null);

    if (isLast) {
      onSubmit?.(answers);
      return;
    }

    setCurrentIndex((i) => Math.min(i + 1, visibleQuestions.length - 1));
  }, [currentQuestion, answers, isLast, visibleQuestions.length, onSubmit]);

  const goBack = useCallback(() => {
    setValidationError(null);
    setCurrentIndex((i) => Math.max(0, i - 1));
  }, []);

  useEffect(() => {
    setCurrentIndex((i) =>
      Math.min(Math.max(0, i), Math.max(0, visibleQuestions.length - 1))
    );
  }, [visibleQuestions.length]);

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
    validateCurrent,
    isCurrentStepValid,
    validationError,
    setValidationError,
  };
}
