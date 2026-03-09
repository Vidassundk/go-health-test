import AppOptionSelectOuter from "./AppOptionSelectOuter";
import { CROSSFADE_DURATION_MS } from "@/constants/animations";
import { COLORS } from "@/constants/colors";
import { TYPOGRAPHY } from "@/constants/typography";
import React, { useState } from "react";
import { StyleSheet, TextInput, TextInputProps, View, type ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const BORDER_RADIUS = 20;
const INSET = 1;

export type AppTextInputProps = TextInputProps & {
  error?: boolean;
  containerStyle?: ViewStyle;
};

export const AppTextInput = React.forwardRef<TextInput, AppTextInputProps>(function AppTextInput(
  { style, onFocus, onBlur, error, containerStyle, ...props },
  ref
) {
  const [layout, setLayout] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const [focused, setFocused] = useState(false);

  const focusedProgress = useSharedValue(0);

  React.useEffect(() => {
    focusedProgress.value = withTiming(focused ? 1 : 0, {
      duration: CROSSFADE_DURATION_MS,
    });
  }, [focused, focusedProgress]);

  const overlayAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(focusedProgress.value, [0, 1], [0, 0.4]),
  }));

  const innerRadius = BORDER_RADIUS - INSET;

  return (
    <View
      style={[styles.wrapper, error && styles.errorBorder, containerStyle]}
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setLayout((prev) =>
          prev?.width === width && prev?.height === height ? prev : { width, height }
        );
      }}
    >
      {layout && (
        <AppOptionSelectOuter
          width={layout.width}
          height={layout.height}
          borderRadius={BORDER_RADIUS}
          selectedProgress={focusedProgress}
          error={error}
        />
      )}
      <View style={[styles.inner, { margin: INSET, borderRadius: innerRadius }]}>
        <Animated.View
          style={[
            styles.overlay,
            {
              borderRadius: innerRadius,
              backgroundColor: COLORS.optionInnerActive,
            },
            overlayAnimatedStyle,
            ,
          ]}
          pointerEvents="none"
        />
        <TextInput
          ref={ref}
          style={[styles.input, style]}
          placeholderTextColor={COLORS.placeholder}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...props}
        />
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    width: "100%",
  },
  errorBorder: {
    borderColor: COLORS.error,
  },
  inner: {
    backgroundColor: COLORS.background,
    overflow: "hidden",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  input: {
    paddingHorizontal: 20,
    paddingVertical: 26,
    color: COLORS.text,
    ...TYPOGRAPHY.bodyCompact,
    lineHeight: 20,
    textAlign: "left",
    textAlignVertical: "center",
  },
});
