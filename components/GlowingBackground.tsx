import { COLORS, GLOW_COLORS } from "@/constants/colors";
import { useGlowContext } from "@/contexts/GlowContext";
import { usePathname } from "expo-router";
import { StyleSheet, View } from "react-native";
import GlowObject from "./GlowObject";

export default function GlowingBackground() {
  const { glowProgress, glowVariant, isHomeBackgroundEnabled } =
    useGlowContext();
  const pathname = usePathname();
  const isHomeScreen = pathname === "/home" && isHomeBackgroundEnabled;
  const summaryColors = glowVariant
    ? GLOW_COLORS.summary[glowVariant]
    : GLOW_COLORS.default;

  return (
    <View pointerEvents="none" style={styles.container}>
      <GlowObject
        width={195}
        height={48}
        color={GLOW_COLORS.default.top}
        colorTo={summaryColors.top}
        colorProgress={glowProgress}
        layerOpacity={0.7268}
        blur={50}
        radius={20}
        animate
        animationMode={isHomeScreen ? "settle" : "loop"}
        driftAmplitude={isHomeScreen ? 0 : 10}
        driftDurationMs={isHomeScreen ? 9000 : 4000}
        settleScale={isHomeScreen ? 2.5 : 1}
        scaleAmplitude={0}
        phaseOffset={0}
        style={{ marginBottom: -18, zIndex: 1 }}
      />
      <GlowObject
        width={310}
        height={48}
        color={GLOW_COLORS.default.bottom}
        colorTo={summaryColors.bottom}
        colorProgress={glowProgress}
        blur={54}
        radius={20}
        animate
        animationMode={isHomeScreen ? "settle" : "loop"}
        driftAmplitude={isHomeScreen ? 0 : 10}
        driftDurationMs={isHomeScreen ? 9000 : 4000}
        settleScale={isHomeScreen ? 2.5 : 1}
        scaleAmplitude={0}
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
