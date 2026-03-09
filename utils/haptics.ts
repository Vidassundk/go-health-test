import * as Haptics from "expo-haptics";

/**
 * Fires a light impact haptic and safely ignores unsupported devices.
 */
export function triggerImpactHaptic() {
  void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
}

/**
 * Fires a selection-change haptic and safely ignores unsupported devices.
 */
export function triggerSelectionHaptic() {
  void Haptics.selectionAsync().catch(() => {});
}
