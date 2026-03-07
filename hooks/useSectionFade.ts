import { FADE_TRANSITION, type TransitionDirection } from "@/utils/fadeTransition";
import { useCallback, useRef, useState } from "react";
import { InteractionManager } from "react-native";
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

function getEnterOffset(direction: TransitionDirection | null): number {
  if (direction === "forward") return FADE_TRANSITION.enterOffset;
  if (direction === "back") return -FADE_TRANSITION.enterOffset;
  return 0;
}

function getTranslateTarget(direction: TransitionDirection): number {
  return direction === "forward"
    ? -FADE_TRANSITION.translatePx
    : FADE_TRANSITION.translatePx;
}

export function useSectionFade() {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const isTransitioningRef = useRef(false);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const lastDirectionRef = useRef<TransitionDirection | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const resetToIdle = useCallback(() => {
    opacity.value = 1;
    translateX.value = 0;
    isTransitioningRef.current = false;
    setIsTransitioning(false);
  }, [opacity, translateX]);

  const runFadeIn = useCallback(() => {
    opacity.value = 0;
    translateX.value = getEnterOffset(lastDirectionRef.current);

    opacity.value = withTiming(1, {
      duration: FADE_TRANSITION.inDuration,
      easing: Easing.out(Easing.cubic),
    });
    translateX.value = withTiming(0, {
      duration: FADE_TRANSITION.inDuration,
      easing: Easing.out(Easing.cubic),
    });
  }, [opacity, translateX]);

  const handleFadeOutComplete = useCallback(() => {
    isTransitioningRef.current = false;
    setIsTransitioning(false);
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
    // Defer fade-in until after React commits the new content. Double rAF
    // ensures we're past the commit so we don't briefly fade in the previous section.
    requestAnimationFrame(() => {
      requestAnimationFrame(runFadeIn);
    });
  }, [runFadeIn]);

  const transitionTo = useCallback(
    (action: () => void, direction: TransitionDirection = "forward") => {
      if (isTransitioningRef.current) {
        return;
      }

      lastDirectionRef.current = direction;
      isTransitioningRef.current = true;
      setIsTransitioning(true);
      pendingActionRef.current = action;

      const translateTarget = getTranslateTarget(direction);

      opacity.value = withTiming(0, {
        duration: FADE_TRANSITION.outOpacityDuration,
        easing: Easing.in(Easing.cubic),
      });
      translateX.value = withTiming(
        translateTarget,
        {
          duration: FADE_TRANSITION.outDuration,
          easing: Easing.inOut(Easing.cubic),
        },
        (finished) => {
          if (finished) {
            runOnJS(handleFadeOutComplete)();
          }
        }
      );
    },
    [opacity, translateX, handleFadeOutComplete]
  );

  const interruptAndRun = useCallback(
    (action: () => void) => {
      if (!isTransitioningRef.current) {
        action();
        return;
      }
      cancelAnimation(opacity);
      cancelAnimation(translateX);
      resetToIdle();
      action();
    },
    [opacity, translateX, resetToIdle]
  );

  return {
    transitionTo,
    interruptAndRun,
    isTransitioning,
    fadeStyle,
  };
}
