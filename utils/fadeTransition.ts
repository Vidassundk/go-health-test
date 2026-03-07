export type TransitionDirection = "forward" | "back";

export const FADE_TRANSITION = {
  inDuration: 300,
  outDuration: 400,
  outOpacityDuration: Math.round(400 * 0.72),
  translatePx: 18,
  enterOffset: 18 * 0.65,
} as const;
