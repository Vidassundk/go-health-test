import AppOptionSelectOuter from "@/components/AppOptionSelectOuter";
import AppText from "@/components/AppText";
import { CheckIcon } from "@/components/Icons/CheckIcon";
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
  interpolateColor,
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
  check?: boolean;
};

export function AppOptionSelect({
  opt,
  selected,
  onPress,
  check = false,
}: AppOptionSelectProps) {
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

  const checkWrapperAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(innerSelectedProgress.value, [0, 1], [0.4, 1]),
    backgroundColor: interpolateColor(
      innerSelectedProgress.value,
      [0, 1],
      [COLORS.optionInnerActive, COLORS.checkBoxBackground]
    ),
  }));

  const checkIconAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(innerSelectedProgress.value, [0, 1], [0, 1]),
  }));

  const innerRadius = BORDER_RADIUS - INSET;

  return (
    <View
      style={styles.optionWrapper}
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
        style={[styles.inner, { margin: INSET, borderRadius: innerRadius }]}
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
          style={styles.pressable}
          android_ripple={null}
        >
          <AppText variant="bodyBold">{opt.title}</AppText>
          {check && (
            <Animated.View
              style={[styles.checkWrapper, checkWrapperAnimatedStyle]}
            >
              <Animated.View style={checkIconAnimatedStyle}>
                <CheckIcon size={10} />
              </Animated.View>
            </Animated.View>
          )}
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
    minHeight: 74,
    paddingVertical: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkWrapper: {
    marginLeft: 8,
    justifyContent: "center",
    alignItems: "center",
    height: 24,
    width: 24,
    borderRadius: 9.6,
  },
  pressableFill: {
    flex: 1,
    minHeight: 1,
  },
  innerFill: {
    flex: 1,
  },
});
