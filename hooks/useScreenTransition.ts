import {
  TRANSITION_ENTER_MS,
  TRANSITION_EXIT_MS,
  TRANSITION_INITIAL_DELAY_MS,
} from "@/constants/animations";
import { useCallback, useMemo, useRef, useState } from "react";
import { FadeInRight, FadeOutLeft, runOnJS } from "react-native-reanimated";

type TransitionDirection = "forward" | "backward";

/**
 * Controls one-screen fade transition flow.
 * `fadeOutThen` hides the screen, waits for exit animation completion,
 * then runs the provided action (usually navigation).
 */
export function useScreenTransition() {
  const [isVisible, setIsVisible] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const isTransitioningRef = useRef(false);
  const handleFadeOutComplete = useCallback(() => {
    isTransitioningRef.current = false;
    setIsTransitioning(false);
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
  }, []);

  const entering = useMemo(
    () => FadeInRight.duration(TRANSITION_ENTER_MS).delay(TRANSITION_INITIAL_DELAY_MS),
    []
  );
  const exiting = useMemo(
    () =>
      FadeOutLeft.duration(TRANSITION_EXIT_MS).withCallback((finished) => {
        "worklet";
        if (finished) {
          runOnJS(handleFadeOutComplete)();
        }
      }),
    [handleFadeOutComplete]
  );

  const fadeOutThen = useCallback(
    (action: () => void, _direction: TransitionDirection = "forward") => {
      if (isTransitioningRef.current) {
        return;
      }

      isTransitioningRef.current = true;
      setIsTransitioning(true);
      pendingActionRef.current = action;
      setIsVisible(false);
    },
    []
  );

  return {
    fadeOutThen,
    isTransitioning,
    isVisible,
    entering,
    exiting,
  };
}
