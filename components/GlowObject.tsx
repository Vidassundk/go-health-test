import {
  Blur,
  Canvas,
  Group,
  Paint,
  RoundedRect,
} from "@shopify/react-native-skia";
import React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

export interface GlowObjectProps {
  width: number;
  height: number;
  radius?: number;
  color: string;
  fillOpacity?: number;
  layerOpacity?: number;
  blur: number;
  style?: StyleProp<ViewStyle>;
}

export default function GlowObject({
  width,
  height,
  radius = 0,
  color,
  fillOpacity = 1,
  layerOpacity = 1,
  blur,
  style,
}: GlowObjectProps) {
  const blurPadding = Math.ceil(blur * 3) * 2;

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
          <Group opacity={fillOpacity}>
            <RoundedRect
              x={blurPadding / 2}
              y={blurPadding / 2}
              width={width}
              height={height}
              r={radius}
              color={color}
            />
          </Group>
        </Group>
      </Canvas>
    </View>
  );
}
