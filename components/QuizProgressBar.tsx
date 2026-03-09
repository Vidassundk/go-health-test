import { COLORS, type ProgressBarColor, PROGRESS_BAR_COLORS } from "@/constants/colors";
import { type GlowVariant, useGlow } from "@/stores";
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

// Keep continuity when the header/progress bar remounts across route transitions.
let lastKnownProgress = 0;
let lastKnownTrackWidth = 0;

function clampProgress(value: number) {
  return Math.max(0, Math.min(1, value));
}

type QuizProgressBarProps = {
  progress: number;
};

export default function QuizProgressBar({ progress }: QuizProgressBarProps) {
  const { glowProgress, glowVariant } = useGlow();
  const animatedProgress = useSharedValue(lastKnownProgress);
  const trackWidth = useSharedValue(lastKnownTrackWidth);
  const targetColor = useSharedValue<ProgressBarColor>(PROGRESS_BAR_COLORS.default);

  useEffect(() => {
    targetColor.value =
      glowVariant != null
        ? PROGRESS_BAR_COLORS.summary[glowVariant as GlowVariant]
        : PROGRESS_BAR_COLORS.default;
  }, [glowVariant, targetColor]);

  useEffect(() => {
    const nextProgress = clampProgress(progress);
    animatedProgress.value = withSpring(nextProgress, SPRING_CONFIG);
    lastKnownProgress = nextProgress;
  }, [progress, animatedProgress]);

  const onLayout = useCallback(
    ({ nativeEvent }: LayoutChangeEvent) => {
      const width = nativeEvent.layout.width;
      trackWidth.value = width;
      lastKnownTrackWidth = width;
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
