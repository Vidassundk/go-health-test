import { useFocusEffect } from "expo-router";
import { useCallback, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

type TransitionDirection = "forward" | "back";
let lastTransitionDirection: TransitionDirection | null = null;

const FADE_IN_DURATION_MS = 300;
const FADE_OUT_DURATION_MS = 400;
const FADE_OUT_OPACITY_DURATION_MS = Math.round(FADE_OUT_DURATION_MS * 0.72);
const TRANSLATE_OUT_DURATION_MS = FADE_OUT_DURATION_MS;
const TRANSLATE_OUT_PX = 18;

export function useScreenFade() {

  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const isTransitioningRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useFocusEffect(
    useCallback(() => {
      opacity.stopAnimation();
      translateX.stopAnimation();
      opacity.setValue(0);
      const enterFromX =
        lastTransitionDirection === "forward"
          ? TRANSLATE_OUT_PX * 0.65
          : lastTransitionDirection === "back"
            ? -TRANSLATE_OUT_PX * 0.65
          : 0;
      translateX.setValue(enterFromX);
      isTransitioningRef.current = false;
      setIsTransitioning(false);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: FADE_IN_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: FADE_IN_DURATION_MS,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }, [opacity, translateX])
  );

  const fadeOutThen = useCallback(
    (action: () => void, direction: TransitionDirection = "forward") => {
      if (isTransitioningRef.current) {
        return;
      }

      lastTransitionDirection = direction;
      isTransitioningRef.current = true;
      setIsTransitioning(true);

      const translateTarget =
        direction === "forward" ? -TRANSLATE_OUT_PX : TRANSLATE_OUT_PX;

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: FADE_OUT_OPACITY_DURATION_MS,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: translateTarget,
          duration: TRANSLATE_OUT_DURATION_MS,
          easing: Easing.inOut(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        isTransitioningRef.current = false;
        setIsTransitioning(false);

        if (finished) {
          action();
        }
      });
    },
    [opacity, translateX]
  );

  return {
    fadeOutThen,
    isTransitioning,
    fadeStyle: {
      opacity,
      transform: [{ translateX }],
    },
  };
}
