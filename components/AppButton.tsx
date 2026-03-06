import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { Canvas } from "@shopify/react-native-skia";
import AppText from "./AppText";
import GradientLayer from "./GradientLayer";
import { usePressProgress } from "@/hooks/usePressProgress";

type AppButtonProps = {
  label: string;
} & Omit<React.ComponentPropsWithoutRef<typeof Pressable>, "children">;

const BORDER_RADIUS = 20;
const LABEL_SCALE_DOWN = 0.98;
const LABEL_TRANSLATE_Y = 0;
const BUTTON_SCALE_DOWN = 0.99;
const PRESS_OVERLAY_OPACITY = 0.12;

const AppButton = ({
  label,
  onPressIn,
  onPressOut,
  ...pressableProps
}: AppButtonProps) => {
  const [layout, setLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const { pressProgress, onPressIn: handlePressIn, onPressOut: handlePressOut } =
    usePressProgress({
      onPressIn: onPressIn ?? undefined,
      onPressOut: onPressOut ?? undefined,
    });

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: 1 - (1 - BUTTON_SCALE_DOWN) * pressProgress.value,
      },
    ],
  }));

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: PRESS_OVERLAY_OPACITY * pressProgress.value,
  }));

  const labelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: 1 - (1 - LABEL_SCALE_DOWN) * pressProgress.value },
      { translateY: LABEL_TRANSLATE_Y * pressProgress.value },
    ],
  }));

  return (
    <View
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setLayout((prev) =>
          prev?.width === width && prev?.height === height
            ? prev
            : { width, height }
        );
      }}
      style={styles.container}
    >
      <Animated.View style={[styles.buttonInner, buttonAnimatedStyle]}>
        {layout && (
          <>
            <Canvas style={{ position: "absolute", width: layout.width, height: layout.height }}>
              <GradientLayer
                width={layout.width}
                height={layout.height}
                borderRadius={BORDER_RADIUS}
                pressProgress={pressProgress}
              />
            </Canvas>
            <Animated.View
              style={[
                styles.pressOverlay,
                {
                  width: layout.width,
                  height: layout.height,
                  borderRadius: BORDER_RADIUS,
                },
                overlayAnimatedStyle,
              ]}
              pointerEvents="none"
            />
          </>
        )}
        <Pressable
          style={styles.pressable}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          {...pressableProps}
        >
          <Animated.View style={labelAnimatedStyle}>
            <AppText style={styles.button} variant="bodyBold" color="#fff">
              {label}
            </AppText>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  buttonInner: {
    position: "relative",
  },
  pressOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#000",
  },
  pressable: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: BORDER_RADIUS,
  },
  button: { textAlign: "center" },
});

export default AppButton;
