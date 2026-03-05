import AppText from "@/components/AppText";
import GlowingBackground from "@/components/GlowingBackground";
import { COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { StyleSheet, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <GlowingBackground />
      <View style={styles.appGreetingSection}>
        <AppText variant="display">{locale.home.greeting}</AppText>
        <AppText color={COLORS.textAlt} variant="bodyCompact">
          {locale.home.subtext}
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
