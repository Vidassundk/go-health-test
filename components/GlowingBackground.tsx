import GlowObject from "@/components/GlowObject";
import { COLORS } from "@/constants/colors";
import { StyleSheet, View } from "react-native";

export default function GlowingBackground() {
  return (
    <View pointerEvents="none" style={styles.container}>
      <GlowObject
        width={195}
        height={48}
        color="#E2B0FF"
        layerOpacity={0.7268}
        blur={50}
        radius={20}
        animate
        phaseOffset={0}
        style={{ marginBottom: -18, zIndex: 1 }}
      />
      <GlowObject
        width={310}
        height={48}
        color="#4717E9"
        blur={54}
        radius={20}
        animate
        phaseOffset={0.4}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    alignItems: "center",
    position: "absolute",
    top: -10,
    right: 0,
    left: 0,
    bottom: 0,
  },
});
