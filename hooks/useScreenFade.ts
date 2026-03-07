import { FADE_TRANSITION, type TransitionDirection } from "@/utils/fadeTransition";
import { useFocusEffect } from "expo-router";
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

let lastTransitionDirection: TransitionDirection | null = null;

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

export function useScreenFade() {
  const opacity = useSharedValue(1);
  const translateX = useSharedValue(0);
  const isTransitioningRef = useRef(false);
  const pendingActionRef = useRef<(() => void) | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const fadeStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateX: translateX.value }],
  }));

  const runFadeIn = useCallback(() => {
    opacity.value = 0;
    translateX.value = getEnterOffset(lastTransitionDirection);

    opacity.value = withTiming(1, {
      duration: FADE_TRANSITION.inDuration,
      easing: Easing.out(Easing.cubic),
    });
    translateX.value = withTiming(0, {
      duration: FADE_TRANSITION.inDuration,
      easing: Easing.out(Easing.cubic),
    });
  }, [opacity, translateX]);

  useFocusEffect(
    useCallback(() => {
      cancelAnimation(opacity);
      cancelAnimation(translateX);
      isTransitioningRef.current = false;
      setIsTransitioning(false);

      const handle = InteractionManager.runAfterInteractions(runFadeIn);
      return () => handle.cancel();
    }, [opacity, translateX, runFadeIn])
  );

  const handleFadeOutComplete = useCallback(() => {
    isTransitioningRef.current = false;
    setIsTransitioning(false);
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    action?.();
  }, []);

  const fadeOutThen = useCallback(
    (action: () => void, direction: TransitionDirection = "forward") => {
      if (isTransitioningRef.current) {
        return;
      }

      lastTransitionDirection = direction;
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

  return {
    fadeOutThen,
    isTransitioning,
    fadeStyle,
  };
}
