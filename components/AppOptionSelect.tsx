import AppText from "@/components/AppText";
import AppOptionSelectOuter from "@/components/AppOptionSelectOuter";
import { COLORS } from "@/constants/colors";
import {
  CROSSFADE_DURATION_MS,
  STAGGER_DELAY_MS,
} from "@/constants/animations";
import type { QuestionOption } from "@/types/quiz";
import React, { useEffect, useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { usePressProgress } from "@/hooks/usePressProgress";

const BORDER_RADIUS = 20;
const INSET = 1;

export type AppOptionSelectProps = {
  opt: QuestionOption;
  selected: boolean;
  onPress: () => void;
};

export function AppOptionSelect({ opt, selected, onPress }: AppOptionSelectProps) {
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

  const innerAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      innerSelectedProgress.value,
      [0, 1],
      [COLORS.background, COLORS.optionInnerActive]
    ),
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
      <Animated.View
        style={[
          { margin: INSET, borderRadius: innerRadius },
          innerAnimatedStyle,
        ]}
      >
        <Pressable
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
          style={styles.pressable}
          android_ripple={null}
        >
          <AppText variant="bodyBold">{opt.title}</AppText>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  optionWrapper: {
    position: "relative",
  },
  pressable: {
    paddingHorizontal: 20,
    paddingVertical: 26,
  },
});
