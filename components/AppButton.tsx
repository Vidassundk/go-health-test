import React, { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import AppText from "./AppText";
import GradientBackground from "./GradientBackground";

type AppButtonProps = {
  label: string;
} & Omit<React.ComponentPropsWithoutRef<typeof Pressable>, "children">;

const BORDER_RADIUS = 20;

const AppButton = ({ label, ...pressableProps }: AppButtonProps) => {
  const [layout, setLayout] = useState<{ width: number; height: number } | null>(
    null
  );

  return (
    <View
      onLayout={(e) => {
        const { width, height } = e.nativeEvent.layout;
        setLayout((prev) =>
          prev?.width === width && prev?.height === height ? prev : { width, height }
        );
      }}
      style={styles.container}
    >
      {layout && (
        <GradientBackground
          width={layout.width}
          height={layout.height}
          borderRadius={BORDER_RADIUS}
        />
      )}
      <Pressable style={styles.pressable} {...pressableProps}>
        <AppText variant="bodyBold" color="#fff">
          {label}
        </AppText>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "stretch",
  },
  pressable: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: BORDER_RADIUS,
  },
});

export default AppButton;
