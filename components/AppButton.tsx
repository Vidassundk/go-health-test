import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import AppText from "./AppText";
import GradientBackground from "./GradientBackground";

type AppButtonProps = {
  label: string;
} & Omit<React.ComponentPropsWithoutRef<typeof Pressable>, "children">;

const BORDER_RADIUS = 20;
const PRESS_DURATION_MS = 80;
const LABEL_SCALE_DOWN = 0.98;
const LABEL_TRANSLATE_Y = 0;
const BUTTON_SCALE_DOWN = 0.99;
const PRESS_OVERLAY_OPACITY = 0.12;

const RELEASE_SPRING = {
  damping: 20,
  stiffness: 200,
};

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
  const pressProgress = useSharedValue(0);

  const handlePressIn = (e: Parameters<NonNullable<typeof onPressIn>>[0]) => {
    pressProgress.value = withTiming(1, { duration: PRESS_DURATION_MS });
    onPressIn?.(e);
  };

  const handlePressOut = (e: Parameters<NonNullable<typeof onPressOut>>[0]) => {
    pressProgress.value = withSpring(0, RELEASE_SPRING);
    onPressOut?.(e);
  };

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
            <GradientBackground
              width={layout.width}
              height={layout.height}
              borderRadius={BORDER_RADIUS}
              pressProgress={pressProgress}
            />
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
            <AppText variant="bodyBold" color="#fff">
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
});

export default AppButton;
