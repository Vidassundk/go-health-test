import AppText from "@/components/AppText";
import GlowingBackground from "@/components/GlowingBackground";
import { COLORS } from "@/constants/colors";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <GlowingBackground />
      <View style={styles.appGreetingSection}>
        <AppText variant="display">
          First & formost, congratulations on this first step.
        </AppText>
        <AppText color={COLORS.textAlt} variant="bodyCompact">
          Be ready to amaze yourself.
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  appGreetingSection: { gap: 24, alignItems: "center" },
});
