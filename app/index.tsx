import AppButton from "@/components/AppButton";
import AppText from "@/components/AppText";
import GlowingBackground from "@/components/GlowingBackground";
import { COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <GlowingBackground />
      <View style={styles.contentArea}>
        <View style={styles.appGreetingSection}>
          <AppText variant="display">{locale.home.greeting}</AppText>
          <AppText color={COLORS.textAlt} variant="bodyCompact">
            {locale.home.subtext}
          </AppText>
        </View>
      </View>
      <AppButton label="Next" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    flex: 1,
    padding: 20,
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
  },
  appGreetingSection: { gap: 24, alignItems: "center" },
});
