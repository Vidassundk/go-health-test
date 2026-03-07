import GradientLayer from "@/components/GradientLayer";
import { OPTION_INACTIVE_OPACITY } from "@/constants/animations";
import { COLORS } from "@/constants/colors";
import { Canvas, Group, RoundedRect } from "@shopify/react-native-skia";
import React from "react";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

type AppOptionSelectOuterProps = {
  width: number;
  height: number;
  borderRadius: number;
  selectedProgress: SharedValue<number>;
  pressProgress?: SharedValue<number>;
  error?: boolean;
};

export default function AppOptionSelectOuter({
  width,
  height,
  borderRadius,
  selectedProgress,
  pressProgress: pressProgressProp,
  error = false,
}: AppOptionSelectOuterProps) {
  const fallback = useSharedValue(0);
  const pressProgress = pressProgressProp ?? fallback;

  const solidOpacity = useDerivedValue(() => {
    "worklet";
    return (
      OPTION_INACTIVE_OPACITY +
      (1 - OPTION_INACTIVE_OPACITY) * selectedProgress.value
    );
  });

  return (
    <Canvas
      style={{ position: "absolute", width, height }}
      pointerEvents="none"
    >
      <Group opacity={solidOpacity}>
        <RoundedRect
          x={0}
          y={0}
          width={width}
          height={height}
          r={borderRadius}
          color={error ? COLORS.optionBorderError : COLORS.optionBorderInactive}
        />
      </Group>
      <GradientLayer
        width={width}
        height={height}
        borderRadius={borderRadius}
        pressProgress={pressProgress}
        entranceProgress={selectedProgress}
        opacity={selectedProgress}
        error={error}
      />
    </Canvas>
  );
}
