import GlowObject from "@/components/GlowObject";
import { StyleSheet, View } from "react-native";

export default function GlowingBackground() {
  return (
    <View style={styles.container}>
      <GlowObject
        width={195}
        height={48}
        color="#E2B0FF"
        layerOpacity={0.7268}
        blur={50}
        radius={20}
        style={{ marginBottom: -18, zIndex: 1 }}
      />
      <GlowObject
        width={310}
        height={48}
        color="#4717E9"
        blur={54}
        radius={20}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    position: "absolute",
    top: 4,
    right: 0,
    left: 0,
    bottom: 0,
  },
});
