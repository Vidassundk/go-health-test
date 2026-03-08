/**
 * Canonical API-backed quiz keys and values used across the app.
 * Keeping them centralized avoids fragile string literal coupling.
 */
export const QUIZ_KEYS = {
  name: "name",
  goal: "goal",
  program: "program",
} as const;

export const PROGRAM_VALUES = {
  quitSmoking: "quit_smoking",
  quitAlcohol: "quit_alcohol",
} as const;
