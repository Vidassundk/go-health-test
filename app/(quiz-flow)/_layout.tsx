import { QuizFlowLayoutFrame } from "@components";
import { CROSSFADE_DURATION_MS } from "@/constants/animations";
import { selectQuizHeaderState, useQuizHeaderStore } from "@/stores";
import { Slot } from "expo-router";
import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useShallow } from "zustand/react/shallow";
import { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

// Android can paint one early frame before effects run, causing a slight header jump.
// Keep the first render hidden and reveal a bit later on Android so layout settles first.
const FIRST_HEADER_REVEAL_DELAY_MS = Platform.OS === "android" ? 130 : 70;

export default function QuizFlowLayout() {
  const { progress, isBackDisabled, hideBackButton, isVisible, onBackPress } = useQuizHeaderStore(
    useShallow(selectQuizHeaderState)
  );
  // Start hidden to avoid first-frame flash before initial layout calculations complete.
  const opacity = useSharedValue(0);
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
      }, FIRST_HEADER_REVEAL_DELAY_MS);

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
