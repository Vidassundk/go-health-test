import React from "react";
import { StyleSheet, View } from "react-native";

type HeaderProps = React.ComponentPropsWithoutRef<typeof View>;

export const HEADER_HEIGHT = 42;

export default function Header({ children, style, ...viewProps }: HeaderProps) {
  return (
    <View style={[styles.container, style]} {...viewProps}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
  },
});
