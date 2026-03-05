import { BUTTON_GRADIENT_COLORS } from "@/constants/colors";
import {
  Canvas,
  LinearGradient,
  RoundedRect,
  vec,
} from "@shopify/react-native-skia";
import React from "react";
const DEFAULT_POSITIONS = [0, 0.5006, 0.7352, 1];

export type GradientBackgroundProps = {
  width: number;
  height: number;
  borderRadius?: number;
  colors?: readonly string[];
  positions?: number[];
};

export default function GradientBackground({
  width,
  height,
  borderRadius = 20,
  colors = [...BUTTON_GRADIENT_COLORS],
  positions = [...DEFAULT_POSITIONS],
}: GradientBackgroundProps) {
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
          start={vec(0, 0)}
          end={vec(width, 0)}
          colors={[...colors]}
          positions={positions}
        />
      </RoundedRect>
    </Canvas>
  );
}
