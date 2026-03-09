import {
  COLORS,
  type ProgressBarColor,
  PROGRESS_BAR_COLORS,
} from "@/constants/colors";
import { type GlowVariant, useGlow } from "@/stores/glowStore";
import React, { useCallback, useEffect } from "react";
import { type LayoutChangeEvent, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const TRACK_HEIGHT = 4;
const SPRING_CONFIG = {
  damping: 50,
  stiffness: 200,
};

type QuizProgressBarProps = {
  progress: number;
};

export default function QuizProgressBar({ progress }: QuizProgressBarProps) {
  const { glowProgress, glowVariant } = useGlow();
  const animatedProgress = useSharedValue(0);
  const trackWidth = useSharedValue(0);
  const targetColor = useSharedValue<ProgressBarColor>(
    PROGRESS_BAR_COLORS.default
  );

  useEffect(() => {
    targetColor.value =
      glowVariant != null
        ? PROGRESS_BAR_COLORS.summary[glowVariant as GlowVariant]
        : PROGRESS_BAR_COLORS.default;
  }, [glowVariant, targetColor]);

  useEffect(() => {
    animatedProgress.value = withSpring(
      Math.max(0, Math.min(1, progress)),
      SPRING_CONFIG
    );
  }, [progress, animatedProgress]);

  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      trackWidth.value = nativeEvent.layout.width;
    },
    [trackWidth]
  );

  const fillStyle = useAnimatedStyle(() => {
    "worklet";
    const fillColor = interpolateColor(
      glowProgress.value,
      [0, 1],
      [PROGRESS_BAR_COLORS.default, targetColor.value]
    );
    return {
      width: animatedProgress.value * trackWidth.value,
      backgroundColor: fillColor,
    };
  });

  return (
    <View style={styles.track} onLayout={onLayout}>
      <Animated.View style={[styles.fill, fillStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    alignSelf: "stretch",
    height: TRACK_HEIGHT,
    borderRadius: 5,
    backgroundColor: COLORS.optionBorderInactive,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 5,
  },
});
