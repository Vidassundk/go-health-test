import { COLORS } from "@/constants/colors";
import { StyleSheet, View } from "react-native";
import { SpinningBuffer } from "./SpinningBuffer";

type FullScreenBufferProps = {
  size?: number;
  color?: string;
};

export function FullScreenBuffer({ size = 40, color = COLORS.text }: FullScreenBufferProps) {
  return (
    <View style={styles.container}>
      <SpinningBuffer size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
