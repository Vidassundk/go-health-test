import { PRESS_DURATION_MS, RELEASE_SPRING } from "@/constants/animations";
import { useCallback, useRef } from "react";
import {
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import type { GestureResponderEvent } from "react-native";

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
