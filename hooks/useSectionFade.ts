import {
  createFadeInAnimation,
  createFadeOutAnimation,
  type TransitionDirection,
} from "@/utils/fadeTransition";
import { useCallback, useRef, useState } from "react";
import { Animated } from "react-native";

export function useSectionFade() {
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const isTransitioningRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const lastDirectionRef = useRef<TransitionDirection | null>(null);

  const runFadeIn = useCallback(() => {
    createFadeInAnimation(
      opacity,
      translateX,
      lastDirectionRef.current
    ).start(({ finished }) => {
      if (finished) {
        isTransitioningRef.current = false;
        setIsTransitioning(false);
      }
    });
  }, [opacity, translateX]);

  const transitionTo = useCallback(
    (action: () => void, direction: TransitionDirection = "forward") => {
      if (isTransitioningRef.current) {
        return;
      }

      lastDirectionRef.current = direction;
      isTransitioningRef.current = true;
      setIsTransitioning(true);

      createFadeOutAnimation(opacity, translateX, direction).start(
        ({ finished }) => {
          if (finished) {
            action();
            runFadeIn();
          }
        }
      );
    },
    [opacity, translateX, runFadeIn]
  );

  return {
    transitionTo,
    isTransitioning,
    fadeStyle: {
      opacity,
      transform: [{ translateX }],
    },
  };
}
