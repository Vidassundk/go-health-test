import { BUTTON_GRADIENT_COLORS } from "@/constants/colors";
import {
  Canvas,
  LinearGradient,
  RoundedRect,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
import type { SharedValue } from "react-native-reanimated";
import { useDerivedValue, useSharedValue } from "react-native-reanimated";

const DEFAULT_POSITIONS = [0, 0.5006, 0.7352, 1];

const GRADIENT_SHIFT_AMOUNT = 80;

export type GradientBackgroundProps = {
  width: number;
  height: number;
  borderRadius?: number;
  colors?: readonly string[];
  positions?: number[];
  /** 0–1 shared value; when > 0, shifts gradient horizontally (for press animation) */
  pressProgress?: SharedValue<number>;
};

export default function GradientBackground({
  width,
  height,
  borderRadius = 20,
  colors = [...BUTTON_GRADIENT_COLORS],
  positions = [...DEFAULT_POSITIONS],
  pressProgress,
}: GradientBackgroundProps) {
  const fallbackProgress = useSharedValue(0);
  const progress = pressProgress ?? fallbackProgress;

  const start = useDerivedValue(() => {
    "worklet";
    const shift = progress.value * GRADIENT_SHIFT_AMOUNT;
    return vec(shift, 0);
  });

  const end = useDerivedValue(() => {
    "worklet";
    const shift = progress.value * GRADIENT_SHIFT_AMOUNT;
    return vec(width + shift, 0);
  });

  return (
    <Canvas
      style={{
        position: "absolute",
        width,
        height,
      }}
    >
      <RoundedRect x={0} y={0} width={width} height={height} r={borderRadius}>
        <LinearGradient
          start={start}
          end={end}
          colors={[...colors]}
          positions={positions}
        />
      </RoundedRect>
    </Canvas>
  );
}
