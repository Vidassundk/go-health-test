/**
 * Section fade transitions for quiz flow (e.g. Credentials → Weight).
 * Performance fix: we keep isTransitioning true until fade-in completes so
 * WeightQuestion mounts with buffer (not WheelPicker), avoiding 2–3s JS block on Android.
 */
import { FADE_TRANSITION, type TransitionDirection } from "@/utils/fadeTransition";
import { useCallback, useRef, useState } from "react";
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

  // Called only when fade-in completes. Keeps isTransitioning true until then so
  // WeightQuestion shows buffer on first mount (WheelPicker would block 2–3s on Android).
  const finalizeTransition = useCallback(() => {
    isTransitioningRef.current = false;
    setIsTransitioning(false);
  }, []);

  const resetToIdle = useCallback(() => {
    opacity.value = 1;
    translateX.value = 0;
    finalizeTransition();
  }, [opacity, translateX, finalizeTransition]);

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
    }, (finished) => {
      // Only clear isTransitioning after fade-in; children use it to show buffer vs WheelPicker.
      if (finished) {
        runOnJS(finalizeTransition)();
      }
    });
  }, [opacity, translateX, finalizeTransition]);

  const handleFadeOutComplete = useCallback(() => {
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
    // Double rAF: wait for React to commit the new section before fading in.
    // On Android, InteractionManager.runAfterInteractions can block 2–3s, so we use rAF instead.
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
