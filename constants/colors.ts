export const COLORS = {
  background: "#07001C",
  text: "#FDFCFE",
  textAlt: "#BCB1FF",
  error: "#F44F43",
  optionBorderInactive: "#4A4884",
  optionBorderError: "#8B3A38",
  optionInnerActive: "#33325B",
  placeholder: "rgba(190, 196, 210, 0.6)",
} as const;

export const BUTTON_GRADIENT_COLORS = [
  "#6C42FF",
  "#469ED4",
  "#34CBBF",
  "#34CBBF",
] as const;

export const ERROR_GRADIENT_COLORS = [
  "#F44F43",
  "#E85A6B",
  "#D46A7A",
  "#D46A7A",
] as const;

export const GRADIENT_POSITIONS = [0, 0.5006, 0.7352, 1] as const;

export const GLOW_COLORS = {
  default: {
    top: "#E2B0FF",
    bottom: "#4717E9",
  },
  summary: {
    smoking: { top: "#E2B0FF", bottom: "#0080FF" },
    drinking: { top: "#E2B0FF", bottom: "#00F0DD" },
  },
} as const;

/** Dominating glow colors per summary variant, used for progress bar fill */
export const PROGRESS_BAR_COLORS = {
  default: COLORS.textAlt,
  summary: {
    smoking: GLOW_COLORS.summary.smoking.bottom,
    drinking: GLOW_COLORS.summary.drinking.bottom,
  },
} as const;

export type ProgressBarColor =
  | (typeof PROGRESS_BAR_COLORS)["default"]
  | (typeof PROGRESS_BAR_COLORS)["summary"][keyof (typeof PROGRESS_BAR_COLORS)["summary"]];
