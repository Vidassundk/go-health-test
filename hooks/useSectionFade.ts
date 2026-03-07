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
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const resetToIdle = useCallback(() => {
    opacity.setValue(1);
    translateX.setValue(0);
    isTransitioningRef.current = false;
    setIsTransitioning(false);
    animationRef.current = null;
  }, [opacity, translateX]);

  const runFadeIn = useCallback(() => {
    const anim = createFadeInAnimation(
      opacity,
      translateX,
      lastDirectionRef.current
    );
    animationRef.current = anim;
    anim.start(({ finished }) => {
      animationRef.current = null;
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

      const anim = createFadeOutAnimation(opacity, translateX, direction);
      animationRef.current = anim;
      anim.start(({ finished }) => {
        animationRef.current = null;
        if (finished) {
          action();
          runFadeIn();
        }
      });
    },
    [opacity, translateX, runFadeIn]
  );

  const interruptAndRun = useCallback(
    (action: () => void) => {
      if (!isTransitioningRef.current) {
        action();
        return;
      }
      animationRef.current?.stop();
      resetToIdle();
      action();
    },
    [resetToIdle]
  );

  return {
    transitionTo,
    interruptAndRun,
    isTransitioning,
    fadeStyle: {
      opacity,
      transform: [{ translateX }],
    },
  };
}
