import type { QuizAnswers } from "@/stores";
import type { QuizQuestion } from "@/types/quiz";
import { describe, expect, it } from "vitest";
import {
  didAnswerValueChange,
  getDependentQuestionKeysForVisibilityValue,
  getVisibleQuestions,
  getVisibilityKeys,
  isStepValid,
  isVisible,
  pickAnswersByKeys,
  toComparableAnswerValue,
} from "./quizEngineCore";

describe("pickAnswersByKeys", () => {
  it("returns empty object when keys set is empty", () => {
    expect(pickAnswersByKeys({ a: 1, b: 2 }, new Set())).toEqual({});
  });

  it("returns only entries whose keys are in the set", () => {
    const answers: QuizAnswers = { a: "1", b: "2", c: "3" };
    expect(pickAnswersByKeys(answers, new Set(["a", "c"]))).toEqual({
      a: "1",
      c: "3",
    });
  });
});

describe("toComparableAnswerValue", () => {
  it("returns null for null and undefined", () => {
    expect(toComparableAnswerValue(null)).toBeNull();
    expect(toComparableAnswerValue(undefined)).toBeNull();
  });

  it("returns string for other values", () => {
    expect(toComparableAnswerValue(42)).toBe("42");
    expect(toComparableAnswerValue("text")).toBe("text");
    expect(toComparableAnswerValue(["a", "b"])).toBe("a,b");
  });
});

describe("didAnswerValueChange", () => {
  it("returns false when previous is null/undefined", () => {
    expect(didAnswerValueChange(null, "new")).toBe(false);
    expect(didAnswerValueChange(undefined, "new")).toBe(false);
  });

  it("returns false when next is null/undefined", () => {
    expect(didAnswerValueChange("old", null)).toBe(false);
    expect(didAnswerValueChange("old", undefined)).toBe(false);
  });

  it("returns false when values are the same", () => {
    expect(didAnswerValueChange("same", "same")).toBe(false);
    expect(didAnswerValueChange(1, 1)).toBe(false);
  });

  it("returns true when both exist and differ", () => {
    expect(didAnswerValueChange("old", "new")).toBe(true);
    expect(didAnswerValueChange(1, 2)).toBe(true);
  });
});

describe("isVisible", () => {
  it("returns true when question has no visibleIf", () => {
    const q: QuizQuestion = { key: "a", subtitle: "", title: "", type: "name" };
    expect(isVisible(q, {})).toBe(true);
  });

  it("returns false when controlling answer is missing", () => {
    const q: QuizQuestion = {
      key: "b",
      subtitle: "",
      title: "",
      type: "single",
      visibleIf: { question: "a", value: "yes" },
    };
    expect(isVisible(q, {})).toBe(false);
    expect(isVisible(q, { a: undefined })).toBe(false);
    expect(isVisible(q, { a: null })).toBe(false);
  });

  it("returns true when single answer matches visibleIf", () => {
    const q: QuizQuestion = {
      key: "b",
      subtitle: "",
      title: "",
      type: "single",
      visibleIf: { question: "a", value: "yes" },
    };
    expect(isVisible(q, { a: "yes" })).toBe(true);
  });

  it("returns false when single answer does not match", () => {
    const q: QuizQuestion = {
      key: "b",
      subtitle: "",
      title: "",
      type: "single",
      visibleIf: { question: "a", value: "yes" },
    };
    expect(isVisible(q, { a: "no" })).toBe(false);
  });

  it("returns true when array answer includes visibleIf value", () => {
    const q: QuizQuestion = {
      key: "b",
      subtitle: "",
      title: "",
      type: "multiple",
      visibleIf: { question: "a", value: "x" },
    };
    expect(isVisible(q, { a: ["x", "y"] })).toBe(true);
  });

  it("returns false when array answer does not include value", () => {
    const q: QuizQuestion = {
      key: "b",
      subtitle: "",
      title: "",
      type: "multiple",
      visibleIf: { question: "a", value: "x" },
    };
    expect(isVisible(q, { a: ["y", "z"] })).toBe(false);
  });
});

describe("getVisibleQuestions", () => {
  it("filters to only visible questions", () => {
    const questions: QuizQuestion[] = [
      { key: "a", subtitle: "", title: "", type: "name" },
      {
        key: "b",
        subtitle: "",
        title: "",
        type: "single",
        visibleIf: { question: "a", value: "show" },
      },
    ];
    const answers: QuizAnswers = { a: "show" };
    const visible = getVisibleQuestions(questions, answers);
    expect(visible).toHaveLength(2);
  });

  it("excludes questions whose visibleIf is not satisfied", () => {
    const questions: QuizQuestion[] = [
      { key: "a", subtitle: "", title: "", type: "name" },
      {
        key: "b",
        subtitle: "",
        title: "",
        type: "single",
        visibleIf: { question: "a", value: "hidden" },
      },
    ];
    const answers: QuizAnswers = { a: "show" };
    const visible = getVisibleQuestions(questions, answers);
    expect(visible).toHaveLength(1);
    expect(visible[0].key).toBe("a");
  });
});

describe("isStepValid", () => {
  it("returns false for empty values", () => {
    const q: QuizQuestion = { key: "a", subtitle: "", title: "", type: "name" };
    expect(isStepValid(q, undefined)).toBe(false);
    expect(isStepValid(q, null)).toBe(false);
    expect(isStepValid(q, "")).toBe(false);
  });

  it("validates weight type (44-1100)", () => {
    const q: QuizQuestion = { key: "w", subtitle: "", title: "", type: "weight" };
    expect(isStepValid(q, 70)).toBe(true);
    expect(isStepValid(q, 44)).toBe(true);
    expect(isStepValid(q, 1100)).toBe(true);
    expect(isStepValid(q, 43)).toBe(false);
    expect(isStepValid(q, 1101)).toBe(false);
    expect(isStepValid(q, "invalid")).toBe(false);
  });

  it("validates age type (1-120)", () => {
    const q: QuizQuestion = { key: "a", subtitle: "", title: "", type: "age" };
    expect(isStepValid(q, 25)).toBe(true);
    expect(isStepValid(q, 1)).toBe(true);
    expect(isStepValid(q, 120)).toBe(true);
    expect(isStepValid(q, 0)).toBe(false);
    expect(isStepValid(q, 121)).toBe(false);
  });

  it("validates credentials type via email and password", () => {
    const q: QuizQuestion = {
      key: "c",
      subtitle: "",
      title: "",
      type: "credentials",
    };
    expect(isStepValid(q, { email: "user@example.com", password: "ValidPass1!" })).toBe(true);
    expect(isStepValid(q, { email: "invalid", password: "ValidPass1!" })).toBe(false);
    expect(isStepValid(q, { email: "user@example.com", password: "short" })).toBe(false);
  });

  it("validates single type (non-empty)", () => {
    const q: QuizQuestion = { key: "s", subtitle: "", title: "", type: "single" };
    expect(isStepValid(q, "option")).toBe(true);
    expect(isStepValid(q, "   ")).toBe(false);
    expect(isStepValid(q, "")).toBe(false);
  });

  it("validates multiple type (non-empty array)", () => {
    const q: QuizQuestion = {
      key: "m",
      subtitle: "",
      title: "",
      type: "multiple",
    };
    expect(isStepValid(q, ["a"])).toBe(true);
    expect(isStepValid(q, [])).toBe(false);
  });

  it("returns true for name and other types", () => {
    const q: QuizQuestion = { key: "n", subtitle: "", title: "", type: "name" };
    expect(isStepValid(q, "Vida")).toBe(true);
  });
});

describe("getVisibilityKeys", () => {
  it("returns empty set when questions is null", () => {
    expect(getVisibilityKeys(null)).toEqual(new Set());
  });

  it("collects keys from visibleIf conditions", () => {
    const questions: QuizQuestion[] = [
      { key: "a", subtitle: "", title: "", type: "name" },
      {
        key: "b",
        subtitle: "",
        title: "",
        type: "single",
        visibleIf: { question: "program", value: "smoking" },
      },
    ];
    expect(getVisibilityKeys(questions)).toEqual(new Set(["program"]));
  });
});

describe("getDependentQuestionKeysForVisibilityValue", () => {
  it("returns keys of questions that match visibility key and value", () => {
    const questions: QuizQuestion[] = [
      {
        key: "smoking_followup",
        subtitle: "",
        title: "",
        type: "single",
        visibleIf: { question: "program", value: "smoking" },
      },
      {
        key: "alcohol_followup",
        subtitle: "",
        title: "",
        type: "single",
        visibleIf: { question: "program", value: "alcohol" },
      },
    ];
    expect(getDependentQuestionKeysForVisibilityValue(questions, "program", "smoking")).toEqual([
      "smoking_followup",
    ]);
  });

  it("returns empty array when no match", () => {
    const questions: QuizQuestion[] = [
      {
        key: "x",
        subtitle: "",
        title: "",
        type: "single",
        visibleIf: { question: "a", value: "b" },
      },
    ];
    expect(getDependentQuestionKeysForVisibilityValue(questions, "a", "c")).toEqual([]);
  });
});
