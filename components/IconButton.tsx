import React from "react";
import { Pressable, StyleSheet } from "react-native";

type IconButtonProps = {
  icon: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<typeof Pressable>, "children">;

export default function IconButton({ icon, style, ...pressableProps }: IconButtonProps) {
  return (
    <Pressable
      style={(state) => [
        styles.button,
        state.pressed && styles.buttonPressed,
        typeof style === "function" ? style(state) : style,
      ]}
      {...pressableProps}
    >
      {icon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.7,
  },
});
