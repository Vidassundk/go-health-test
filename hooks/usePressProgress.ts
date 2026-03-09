import { useCallback, useRef } from "react";
import type { GestureResponderEvent } from "react-native";
import { useSharedValue, withSpring, withTiming } from "react-native-reanimated";

const PRESS_DURATION_MS = 80;
const RELEASE_SPRING = { damping: 20, stiffness: 200 };

/**
 * Provides a shared press progress value (0→1) and ready-to-use press handlers.
 * Useful for components that animate on press while preserving caller callbacks.
 */
export function usePressProgress(callbacks?: {
  onPressIn?: (e: GestureResponderEvent) => void;
  onPressOut?: (e: GestureResponderEvent) => void;
}) {
  const pressProgress = useSharedValue(0);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const onPressIn = useCallback(
    (e: GestureResponderEvent) => {
      pressProgress.value = withTiming(1, { duration: PRESS_DURATION_MS });
      callbacksRef.current?.onPressIn?.(e);
    },
    [pressProgress]
  );

  const onPressOut = useCallback(
    (e: GestureResponderEvent) => {
      pressProgress.value = withSpring(0, RELEASE_SPRING);
      callbacksRef.current?.onPressOut?.(e);
    },
    [pressProgress]
  );

  return { pressProgress, onPressIn, onPressOut };
}
