import { PROGRAM_VALUES, QUIZ_KEYS } from "@/constants/quiz";
import type { QuizAnswers } from "@/stores/quizStore";
import type { QuizQuestion } from "@/types/quiz";
import { getSummaryDisplayData } from "@/utils/getSummaryDisplayData";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import { describe, expect, it } from "vitest";

const baseQuestions: QuizQuestion[] = [
  {
    key: QUIZ_KEYS.name,
    subtitle: "About you",
    title: "Your name",
    type: "name",
  },
  {
    key: QUIZ_KEYS.goal,
    subtitle: "Main objective",
    title: "What is your goal?",
    type: "single",
    options: [
      { value: "more_control", title: "Get more control" },
      { value: "save_money", title: "Save money" },
    ],
  },
  {
    key: QUIZ_KEYS.program,
    subtitle: "Program",
    title: "What do you want to quit?",
    type: "single",
    options: [
      { value: PROGRAM_VALUES.quitSmoking, title: "Quit smoking" },
      { value: PROGRAM_VALUES.quitAlcohol, title: "Quit alcohol" },
    ],
  },
  {
    key: "complements",
    subtitle: "Other goals",
    title: "What else matters?",
    type: "multiple",
    options: [
      { value: "better_sleep", title: "Improve sleep" },
      { value: "more_energy", title: "More energy" },
    ],
  },
];

describe("getSummaryVariant", () => {
  it("returns drinking for quit alcohol program", () => {
    const answers: QuizAnswers = { [QUIZ_KEYS.program]: PROGRAM_VALUES.quitAlcohol };
    expect(getSummaryVariant(answers)).toBe("drinking");
  });

  it("returns smoking for quit smoking or missing program", () => {
    const smokingAnswers: QuizAnswers = {
      [QUIZ_KEYS.program]: PROGRAM_VALUES.quitSmoking,
    };
    const missingProgramAnswers: QuizAnswers = {};

    expect(getSummaryVariant(smokingAnswers)).toBe("smoking");
    expect(getSummaryVariant(missingProgramAnswers)).toBe("smoking");
  });
});

describe("getSummaryDisplayData", () => {
  it("maps name, goal and complementary goals from questions/options", () => {
    const answers: QuizAnswers = {
      [QUIZ_KEYS.name]: " Vida ",
      [QUIZ_KEYS.goal]: "more_control",
      [QUIZ_KEYS.program]: PROGRAM_VALUES.quitAlcohol,
      complements: ["better_sleep", "more_energy"],
    };

    const result = getSummaryDisplayData(answers, baseQuestions);

    expect(result.name).toBe("Vida");
    expect(result.mainGoal).toBe("Get more control");
    expect(result.complementaryGoals).toEqual([
      "Quit alcohol",
      "Improve sleep",
      "More energy",
    ]);
  });

  it("uses safe fallbacks when key answers are missing", () => {
    const result = getSummaryDisplayData({}, baseQuestions);

    expect(result.name).toBe("there");
    expect(result.mainGoal).toBe("Improve my health");
    expect(result.complementaryGoals).toEqual([]);
  });
});
