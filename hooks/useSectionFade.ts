/**
 * Section fade transitions for quiz flow (e.g. Credentials → Weight).
 * Performance fix: we keep isTransitioning true until fade-in completes so
 * WeightQuestion mounts with buffer (not WheelPicker), avoiding 2–3s JS block on Android.
 */
import { FADE_TRANSITION, type TransitionDirection } from "@/utils/fadeTransition";
import { useCallback, useEffect, useRef, useState } from "react";
import {
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
  const incomingOpacity = useSharedValue(1);
  const incomingTranslateX = useSharedValue(0);
  const outgoingOpacity = useSharedValue(0);
  const outgoingTranslateX = useSharedValue(0);
  const actionRafRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const incomingStyle = useAnimatedStyle(() => ({
    opacity: incomingOpacity.value,
    transform: [{ translateX: incomingTranslateX.value }],
  }));

  const outgoingStyle = useAnimatedStyle(() => ({
    opacity: outgoingOpacity.value,
    transform: [{ translateX: outgoingTranslateX.value }],
  }));

  const finishTransition = useCallback(() => {
    isTransitioningRef.current = false;
    setIsTransitioning(false);
  }, []);

  const cancelQueuedAction = useCallback(() => {
    if (actionRafRef.current !== null) {
      cancelAnimationFrame(actionRafRef.current);
      actionRafRef.current = null;
    }
  }, []);

  const startIncomingAnimation = useCallback(() => {
    incomingOpacity.value = 1;
    incomingTranslateX.value = withTiming(
      0,
      {
        duration: FADE_TRANSITION.inDuration,
        easing: Easing.out(Easing.cubic),
      },
      (finished) => {
        if (finished) {
          outgoingOpacity.value = 0;
          outgoingTranslateX.value = 0;
          runOnJS(finishTransition)();
        }
      }
    );
  }, [
    finishTransition,
    incomingOpacity,
    incomingTranslateX,
    outgoingOpacity,
    outgoingTranslateX,
  ]);

  const resetToIdle = useCallback(() => {
    cancelQueuedAction();
    incomingOpacity.value = 1;
    incomingTranslateX.value = 0;
    outgoingOpacity.value = 0;
    outgoingTranslateX.value = 0;
    finishTransition();
  }, [
    cancelQueuedAction,
    finishTransition,
    incomingOpacity,
    incomingTranslateX,
    outgoingOpacity,
    outgoingTranslateX,
  ]);

  const transitionTo = useCallback(
    (action: () => void, direction: TransitionDirection = "forward") => {
      if (isTransitioningRef.current) {
        return;
      }

      cancelQueuedAction();
      isTransitioningRef.current = true;
      setIsTransitioning(true);

      const enterOffset = getEnterOffset(direction);
      const translateTarget = getTranslateTarget(direction);

      outgoingOpacity.value = 1;
      outgoingTranslateX.value = 0;
      incomingOpacity.value = 0;
      incomingTranslateX.value = enterOffset;

      // rAF: swap content, instant opacity flip (0/1), then animate incoming translate.
      actionRafRef.current = requestAnimationFrame(() => {
        actionRafRef.current = null;
        try {
          action();
          outgoingOpacity.value = 0;
          incomingOpacity.value = 1;
          startIncomingAnimation();
        } catch (error) {
          resetToIdle();
          throw error;
        }
      });
      outgoingTranslateX.value = withTiming(translateTarget, {
        duration: FADE_TRANSITION.outDuration,
        easing: Easing.inOut(Easing.cubic),
      });
    },
    [
      cancelQueuedAction,
      incomingOpacity,
      incomingTranslateX,
      outgoingOpacity,
      outgoingTranslateX,
      resetToIdle,
      startIncomingAnimation,
    ]
  );

  const interruptAndRun = useCallback(
    (action: () => void) => {
      if (!isTransitioningRef.current) {
        action();
        return;
      }
      cancelAnimation(incomingOpacity);
      cancelAnimation(incomingTranslateX);
      cancelAnimation(outgoingOpacity);
      cancelAnimation(outgoingTranslateX);
      resetToIdle();
      action();
    },
    [
      incomingOpacity,
      incomingTranslateX,
      outgoingOpacity,
      outgoingTranslateX,
      resetToIdle,
    ]
  );

  useEffect(() => {
    return () => {
      cancelQueuedAction();
      cancelAnimation(incomingOpacity);
      cancelAnimation(incomingTranslateX);
      cancelAnimation(outgoingOpacity);
      cancelAnimation(outgoingTranslateX);
      isTransitioningRef.current = false;
    };
  }, [
    cancelQueuedAction,
    incomingOpacity,
    incomingTranslateX,
    outgoingOpacity,
    outgoingTranslateX,
  ]);

  return {
    transitionTo,
    interruptAndRun,
    isTransitioning,
    fadeStyle: incomingStyle,
    incomingStyle,
    outgoingStyle,
  };
}
