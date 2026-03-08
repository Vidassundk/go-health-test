export function isDebugWipeDataButtonEnabled(): boolean {
  return process.env.EXPO_PUBLIC_DEBUG_WIPE_DATA_BUTTON === "true";
}

export function isDebugSkipQuizToSummaryEnabled(): boolean {
  return process.env.EXPO_PUBLIC_DEBUG_SKIP_QUIZ_TO_SUMMARY === "true";
}
