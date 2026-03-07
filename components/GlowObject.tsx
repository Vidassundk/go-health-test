import {
  Blur,
  Canvas,
  Group,
  interpolateColors,
  Paint,
  RoundedRect,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const DRIFT_AMPLITUDE = 10;
const DRIFT_DURATION_MS = 4000;

export interface GlowObjectProps {
  width: number;
  height: number;
  radius?: number;
  color: string;
  /** Target color when progress is 1 (for Summary screen glow shift) */
  colorTo?: string;
  /** 0 = color, 1 = colorTo. When provided with colorTo, animates between them. */
  colorProgress?: SharedValue<number>;
  fillOpacity?: number;
  layerOpacity?: number;
  blur: number;
  style?: StyleProp<ViewStyle>;
  /** Enable subtle looping drift animation */
  animate?: boolean;
  /** 0–1 phase offset for staggering multiple glows */
  phaseOffset?: number;
}

export default function GlowObject({
  width,
  height,
  radius = 0,
  color,
  colorTo,
  colorProgress,
  fillOpacity = 1,
  layerOpacity = 1,
  blur,
  style,
  animate = false,
  phaseOffset = 0,
}: GlowObjectProps) {
  const blurPadding = Math.ceil(blur * 3) * 2;
  const progress = useSharedValue(0);

  useEffect(() => {
    if (!animate) return;
    progress.value = withRepeat(
      withTiming(1, { duration: DRIFT_DURATION_MS }),
      -1,
      true
    );
  }, [animate, progress]);

  const driftTransform = useDerivedValue(() => {
    "worklet";
    if (!animate) return [{ translateX: 0 }, { translateY: 0 }];
    const t = progress.value * Math.PI * 2 + phaseOffset * Math.PI * 2;
    const translateX = Math.sin(t) * DRIFT_AMPLITUDE;
    const translateY = Math.cos(t * 0.7) * DRIFT_AMPLITUDE * 0.8;
    return [{ translateX }, { translateY }];
  });

  const resolvedColor = useDerivedValue(() => {
    "worklet";
    if (colorTo != null && colorProgress != null) {
      return interpolateColors(colorProgress.value, [0, 1], [color, colorTo]);
    }
    return color;
  });

  return (
    <View
      style={[
        {
          width,
          height,
          overflow: "visible" as const,
        },
        style,
      ]}
    >
      <Canvas
        style={{
          position: "absolute",
          left: -blurPadding / 2,
          top: -blurPadding / 2,
          width: width + blurPadding,
          height: height + blurPadding,
          opacity: layerOpacity,
        }}
      >
        <Group
          layer={
            <Paint>
              <Blur blur={blur} />
            </Paint>
          }
        >
          <Group opacity={fillOpacity} transform={driftTransform}>
            <RoundedRect
              x={blurPadding / 2}
              y={blurPadding / 2}
              width={width}
              height={height}
              r={radius}
              color={resolvedColor}
            />
          </Group>
        </Group>
      </Canvas>
    </View>
  );
}
