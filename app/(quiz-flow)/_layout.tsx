import { QuizFlowLayoutFrame } from "@components";
import { CROSSFADE_DURATION_MS } from "@/constants/animations";
import { selectQuizHeaderState, useQuizHeaderStore } from "@/stores";
import { Slot } from "expo-router";
import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

export default function QuizFlowLayout() {
  const { progress, isBackDisabled, hideBackButton, isVisible, onBackPress } = useQuizHeaderStore(
    useShallow(selectQuizHeaderState)
  );
  const opacity = useSharedValue(isVisible ? 1 : 0);
  const hasShownHeaderOnce = useRef(false);

  useEffect(() => {
    if (!isVisible) {
      opacity.value = withTiming(0, { duration: CROSSFADE_DURATION_MS });
      return;
    }

    if (!hasShownHeaderOnce.current) {
      hasShownHeaderOnce.current = true;
      opacity.value = 0;

      // Delay first reveal so initial layout work is never rendered.
      const timeoutId = setTimeout(() => {
        opacity.value = withTiming(1, { duration: CROSSFADE_DURATION_MS });
      }, 70);

      return () => clearTimeout(timeoutId);
    }

    opacity.value = withTiming(1, { duration: CROSSFADE_DURATION_MS });
  }, [isVisible, opacity]);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <QuizFlowLayoutFrame
      isVisible={isVisible}
      animatedHeaderStyle={animatedHeaderStyle}
      onBackPress={onBackPress}
      isBackDisabled={isBackDisabled}
      hideBackButton={hideBackButton}
      progress={progress}
    >
      <Slot />
    </QuizFlowLayoutFrame>
  );
}
