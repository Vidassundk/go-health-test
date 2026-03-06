import AppOptionSelectOuter from "@/components/AppOptionSelectOuter";
import AppText from "@/components/AppText";
import {
  CROSSFADE_DURATION_MS,
  STAGGER_DELAY_MS,
} from "@/constants/animations";
import { COLORS } from "@/constants/colors";
import { usePressProgress } from "@/hooks/usePressProgress";
import type { QuestionOption } from "@/types/quiz";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const BORDER_RADIUS = 20;
const INSET = 1;

export type AppOptionSelectProps = {
  opt: QuestionOption;
  selected: boolean;
  onPress: () => void;
};

export function AppOptionSelect({
  opt,
  selected,
  onPress,
}: AppOptionSelectProps) {
  const hasLabel = Boolean(opt.title);
  const [layout, setLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const outerSelectedProgress = useSharedValue(selected ? 1 : 0);
  const innerSelectedProgress = useSharedValue(selected ? 1 : 0);

  const { pressProgress, onPressIn, onPressOut } = usePressProgress({
    onPressIn: () => {
      if (!selected) {
        outerSelectedProgress.value = withTiming(1, {
          duration: CROSSFADE_DURATION_MS,
        });
      }
    },
  });

  useEffect(() => {
    const toValue = selected ? 1 : 0;
    outerSelectedProgress.value = withTiming(toValue, {
      duration: CROSSFADE_DURATION_MS,
    });
    innerSelectedProgress.value = withDelay(
      STAGGER_DELAY_MS,
      withTiming(toValue, { duration: CROSSFADE_DURATION_MS })
    );
  }, [selected, outerSelectedProgress, innerSelectedProgress]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(innerSelectedProgress.value, [0, 1], [0, 0.4]),
  }));

  const innerRadius = BORDER_RADIUS - INSET;

  return (
    <View
      style={styles.optionWrapper}
      pointerEvents={hasLabel ? "auto" : "none"}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setLayout((prev) =>
          prev?.width === width && prev?.height === height
            ? prev
            : { width, height }
        );
      }}
    >
      {layout && (
        <AppOptionSelectOuter
          width={layout.width}
          height={layout.height}
          borderRadius={BORDER_RADIUS}
          selectedProgress={outerSelectedProgress}
          pressProgress={pressProgress}
        />
      )}
      <View
        style={[
          styles.inner,
          { margin: INSET, borderRadius: innerRadius },
          !hasLabel && styles.innerFill,
        ]}
      >
        <Animated.View
          style={[
            styles.overlay,
            {
              borderRadius: innerRadius,
              backgroundColor: COLORS.optionInnerActive,
            },
            overlayAnimatedStyle,
          ]}
          pointerEvents="none"
        />
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={hasLabel ? styles.pressable : styles.pressableFill}
          android_ripple={null}
        >
          {hasLabel && <AppText variant="bodyBold">{opt.title}</AppText>}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  optionWrapper: {
    position: "relative",
  },
  inner: {
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  pressable: {
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
  pressableFill: {
    flex: 1,
    minHeight: 1,
  },
  innerFill: {
    flex: 1,
  },
});
