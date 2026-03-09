import { vec } from "@shopify/react-native-skia";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue } from "react-native-reanimated";

const GRADIENT_SHIFT_AMOUNT = 80;

/**
 * Computes animated gradient start/end points based on button width,
 * press state, and optional entrance progress.
 */
export function useGradientShift(
  width: number,
  pressProgress: SharedValue<number>,
  entranceProgress?: SharedValue<number>
) {
  const start = useDerivedValue(() => {
    "worklet";
    const pressShift = pressProgress.value * GRADIENT_SHIFT_AMOUNT;
    const entranceShift = entranceProgress
      ? (1 - entranceProgress.value) * GRADIENT_SHIFT_AMOUNT
      : 0;
    return vec(pressShift + entranceShift, 0);
  });

  const end = useDerivedValue(() => {
    "worklet";
    const pressShift = pressProgress.value * GRADIENT_SHIFT_AMOUNT;
    const entranceShift = entranceProgress
      ? (1 - entranceProgress.value) * GRADIENT_SHIFT_AMOUNT
      : 0;
    return vec(width + pressShift + entranceShift, 0);
  });

  return { start, end };
}
