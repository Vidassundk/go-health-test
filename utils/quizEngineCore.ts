import type { QuizAnswers } from "@/stores";
import type { QuizQuestion } from "@/types/quiz";
import { getEmailValidationError, getPasswordValidationError } from "@/utils/validation";

/**
 * Keep only answers that control visibility (visibleIf.question keys).
 * This lets the visibility computation ignore unrelated answer changes.
 */
export function pickAnswersByKeys(answers: QuizAnswers, keys: Set<string>): Partial<QuizAnswers> {
  if (keys.size === 0) {
    return {};
  }
  return Object.fromEntries(Object.entries(answers).filter(([key]) => keys.has(key)));
}

/** Normalize unknown store values into comparable string form. */
export function toComparableAnswerValue(value: unknown): string | null {
  if (value === undefined || value === null) {
    return null;
  }
  return String(value);
}

/**
 * We only treat this as a branch change when both values exist and differ.
 * (null/undefined -> something does not clear previous branch answers)
 */
export function didAnswerValueChange(previous: unknown, next: unknown): boolean {
  const previousValue = toComparableAnswerValue(previous);
  const nextValue = toComparableAnswerValue(next);
  return previousValue !== null && nextValue !== null && previousValue !== nextValue;
}

export function isVisible(question: QuizQuestion, answers: QuizAnswers): boolean {
  const condition = question.visibleIf;
  if (!condition) return true;

  const answer = answers[condition.question];
  if (answer === undefined || answer === null) return false;

  if (Array.isArray(answer)) {
    return answer.includes(condition.value);
  }
  return String(answer) === condition.value;
}

export function getVisibleQuestions(
  questions: QuizQuestion[],
  answers: QuizAnswers
): QuizQuestion[] {
  return questions.filter((q) => isVisible(q, answers));
}

export function isStepValid(question: QuizQuestion, value: unknown): boolean {
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
      return !getEmailValidationError(v?.email) && !getPasswordValidationError(v?.password);
    }
    case "single":
      return !!(value && (typeof value !== "string" || value.trim()));
    case "multiple":
      return Array.isArray(value) && value.length > 0;
    default:
      return true;
  }
}

/** Keys from answers that affect question visibility (visibleIf conditions) */
export function getVisibilityKeys(questions: QuizQuestion[] | null): Set<string> {
  if (!questions) return new Set();
  return new Set(questions.flatMap((q) => (q.visibleIf ? [q.visibleIf.question] : [])));
}

/** Keys controlled by a visibility condition branch; cleared when branch selection changes */
export function getDependentQuestionKeysForVisibilityValue(
  questions: QuizQuestion[],
  visibilityKey: string,
  value: string
): string[] {
  return questions
    .filter((q) => q.visibleIf?.question === visibilityKey && q.visibleIf?.value === value)
    .map((q) => q.key);
}
