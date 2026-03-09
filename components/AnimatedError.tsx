import AppText from "./AppText";
import { COLORS } from "@/constants/colors";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const ERROR_ANIMATION_DURATION_MS = 200;
const ERROR_EXIT_PHASE1_MS = 120;
const ERROR_EXIT_PHASE2_MS = 80;
const ERROR_EXIT_TRANSLATE_Y = -12;
const ERROR_MESSAGE_HEIGHT = 22;

type Props = {
  error: string | null;
};

export function AnimatedError({ error }: Props) {
  const [displayText, setDisplayText] = useState<string | null>(null);

  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(ERROR_EXIT_TRANSLATE_Y);

  useEffect(() => {
    if (error) {
      setDisplayText(error);
      height.value = withTiming(ERROR_MESSAGE_HEIGHT, {
        duration: ERROR_ANIMATION_DURATION_MS,
      });
      opacity.value = withTiming(1, {
        duration: ERROR_ANIMATION_DURATION_MS,
      });
      translateY.value = withTiming(0, {
        duration: ERROR_ANIMATION_DURATION_MS,
      });
    } else {
      opacity.value = withTiming(0, { duration: ERROR_EXIT_PHASE1_MS });
      translateY.value = withTiming(ERROR_EXIT_TRANSLATE_Y, {
        duration: ERROR_EXIT_PHASE1_MS,
      });
      height.value = withDelay(
        ERROR_EXIT_PHASE1_MS,
        withTiming(0, { duration: ERROR_EXIT_PHASE2_MS }, (finished) => {
          if (finished) {
            runOnJS(setDisplayText)(null);
          }
        })
      );
    }
  }, [error, height, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View style={[styles.error, animatedStyle]}>
      {displayText && (
        <AppText variant="body" color={COLORS.error}>
          {displayText}
        </AppText>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  error: {
    marginTop: 4,
    overflow: "hidden",
  },
});
