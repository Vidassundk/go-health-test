import {
  Blur,
  Canvas,
  Group,
  interpolateColors,
  Paint,
  RoundedRect,
} from "@shopify/react-native-skia";
import React, { useEffect } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import type { SharedValue } from "react-native-reanimated";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

const DEFAULT_DRIFT_AMPLITUDE = 10;
const DEFAULT_DRIFT_DURATION_MS = 4000;
const MODE_TRANSITION_MS = 1400;

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
  /** Horizontal/vertical drift amplitude in pixels. */
  driftAmplitude?: number;
  /** Duration of one drift half-cycle. */
  driftDurationMs?: number;
  /** Optional subtle breathing scale amplitude (e.g. 0.05 = +-5%). */
  scaleAmplitude?: number;
  /** Loop forever (default) or animate once and settle. */
  animationMode?: "loop" | "settle";
  /** Target scale used by "settle" mode. */
  settleScale?: number;
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
  driftAmplitude = DEFAULT_DRIFT_AMPLITUDE,
  driftDurationMs = DEFAULT_DRIFT_DURATION_MS,
  scaleAmplitude = 0,
  animationMode = "loop",
  settleScale = 1,
}: GlowObjectProps) {
  const blurPadding = Math.ceil(blur * 3) * 2;
  const loopProgress = useSharedValue(0);
  const settleProgress = useSharedValue(0);
  // Keep the last Home settle scale so exiting Home can blend down smoothly
  // instead of snapping when props switch settleScale back to 1.
  const settledScaleValue = useSharedValue(1);
  const modeBlend = useSharedValue(animationMode === "loop" ? 1 : 0);

  useEffect(() => {
    if (!animate) return;
    loopProgress.value = withRepeat(withTiming(1, { duration: driftDurationMs }), -1, true);
  }, [animate, driftDurationMs, loopProgress]);

  useEffect(() => {
    if (!animate) return;
    modeBlend.value = withTiming(animationMode === "loop" ? 1 : 0, {
      duration: MODE_TRANSITION_MS,
      easing: Easing.inOut(Easing.cubic),
    });
    if (animationMode === "settle") {
      settledScaleValue.value = settleScale;
      settleProgress.value = withTiming(1, { duration: driftDurationMs });
    }
  }, [
    animate,
    animationMode,
    driftDurationMs,
    modeBlend,
    settleProgress,
    settleScale,
    settledScaleValue,
  ]);

  const driftTransform = useDerivedValue(() => {
    "worklet";
    if (!animate) return [{ translateX: 0 }, { translateY: 0 }];

    const t = loopProgress.value * Math.PI * 2 + phaseOffset * Math.PI * 2;
    const loopTranslateX = Math.sin(t) * driftAmplitude;
    const loopTranslateY = Math.cos(t * 0.7) * driftAmplitude * 0.8;
    const blend = modeBlend.value;

    return [{ translateX: loopTranslateX * blend }, { translateY: loopTranslateY * blend }];
  });

  const animatedContainerStyle = useAnimatedStyle(() => {
    if (!animate) return { transform: [{ scale: 1 }] };
    const t = loopProgress.value * Math.PI * 2 + phaseOffset * Math.PI * 2;
    const loopScale = 1 + Math.sin(t * 0.5) * scaleAmplitude;
    const settledScale = 1 + (settledScaleValue.value - 1) * settleProgress.value;
    const blend = modeBlend.value;
    const scale = settledScale + (loopScale - settledScale) * blend;
    return { transform: [{ scale }] };
  });

  const resolvedColor = useDerivedValue(() => {
    "worklet";
    if (colorTo != null && colorProgress != null) {
      return interpolateColors(colorProgress.value, [0, 1], [color, colorTo]);
    }
    return color;
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          overflow: "visible" as const,
        },
        style,
        animatedContainerStyle,
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
    </Animated.View>
  );
}
