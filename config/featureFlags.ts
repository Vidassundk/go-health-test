export function isDebugWipeDataButtonEnabled(): boolean {
  return process.env.EXPO_PUBLIC_DEBUG_WIPE_DATA_BUTTON === "true";
}
