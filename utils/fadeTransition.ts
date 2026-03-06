import { Animated, Easing } from "react-native";

export type TransitionDirection = "forward" | "back";

export const FADE_TRANSITION = {
  inDuration: 300,
  outDuration: 400,
  outOpacityDuration: Math.round(400 * 0.72),
  translatePx: 18,
  enterOffset: 18 * 0.65,
} as const;

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

export function createFadeOutAnimation(
  opacity: Animated.Value,
  translateX: Animated.Value,
  direction: TransitionDirection
): Animated.CompositeAnimation {
  const translateTarget = getTranslateTarget(direction);
  return Animated.parallel([
    Animated.timing(opacity, {
      toValue: 0,
      duration: FADE_TRANSITION.outOpacityDuration,
      easing: Easing.in(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(translateX, {
      toValue: translateTarget,
      duration: FADE_TRANSITION.outDuration,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: true,
    }),
  ]);
}

export function createFadeInAnimation(
  opacity: Animated.Value,
  translateX: Animated.Value,
  lastDirection: TransitionDirection | null
): Animated.CompositeAnimation {
  opacity.setValue(0);
  translateX.setValue(getEnterOffset(lastDirection));

  return Animated.parallel([
    Animated.timing(opacity, {
      toValue: 1,
      duration: FADE_TRANSITION.inDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
    Animated.timing(translateX, {
      toValue: 0,
      duration: FADE_TRANSITION.inDuration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }),
  ]);
}
