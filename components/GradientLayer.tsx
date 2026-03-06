import { BUTTON_GRADIENT_COLORS, GRADIENT_POSITIONS } from "@/constants/colors";
import { Group, LinearGradient, RoundedRect } from "@shopify/react-native-skia";
import React from "react";
import type { SharedValue } from "react-native-reanimated";
import { useSharedValue } from "react-native-reanimated";
import { useGradientShift } from "@/hooks/useGradientShift";

type GradientLayerProps = {
  width: number;
  height: number;
  borderRadius: number;
  pressProgress?: SharedValue<number>;
  entranceProgress?: SharedValue<number>;
  opacity?: SharedValue<number>;
};

export default function GradientLayer({
  width,
  height,
  borderRadius,
  pressProgress: pressProgressProp,
  entranceProgress,
  opacity,
}: GradientLayerProps) {
  const fallback = useSharedValue(0);
  const pressProgress = pressProgressProp ?? fallback;
  const { start, end } = useGradientShift(width, pressProgress, entranceProgress);

  const content = (
    <RoundedRect x={0} y={0} width={width} height={height} r={borderRadius}>
      <LinearGradient
        start={start}
        end={end}
        colors={[...BUTTON_GRADIENT_COLORS]}
        positions={[...GRADIENT_POSITIONS]}
      />
    </RoundedRect>
  );

  return opacity ? <Group opacity={opacity}>{content}</Group> : content;
}
