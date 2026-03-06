import AppOptionSelectOuter from "@/components/AppOptionSelectOuter";
import { COLORS } from "@/constants/colors";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useSharedValue } from "react-native-reanimated";

const BORDER_RADIUS = 20;
const INSET = 1;
const INNER_OVERLAY_OPACITY = 0.4;

type Props = {
  height: number;
  style?: object;
};

export function AppOptionSelectChrome({ height, style }: Props) {
  const [width, setWidth] = useState<number | null>(null);
  const selectedProgress = useSharedValue(1);
  const pressProgress = useSharedValue(0);

  return (
    <View
      style={[styles.wrapper, { height }, style]}
      pointerEvents="none"
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
    >
      {width !== null && (
        <>
          <AppOptionSelectOuter
            width={width}
            height={height}
            borderRadius={BORDER_RADIUS}
            selectedProgress={selectedProgress}
            pressProgress={pressProgress}
          />
          <View
            style={[
              styles.inner,
              {
                margin: INSET,
                borderRadius: BORDER_RADIUS - INSET,
              },
            ]}
          >
            <View
              style={[
                styles.overlay,
                {
                  borderRadius: BORDER_RADIUS - INSET,
                  backgroundColor: COLORS.optionInnerActive,
                  opacity: INNER_OVERLAY_OPACITY,
                },
              ]}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    alignSelf: "stretch",
  },
  inner: {
    flex: 1,
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
