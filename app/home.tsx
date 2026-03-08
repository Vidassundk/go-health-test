import AppButton from "@/components/AppButton";
import AppText from "@/components/AppText";
import { COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { useScreenFade } from "@/hooks/useScreenFade";
import { useQuizStore } from "@/stores/quizStore";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const router = useRouter();
  const reset = useQuizStore((s) => s.reset);
  const { fadeStyle, fadeOutThen, isTransitioning } = useScreenFade();
  const { title, text, startOver } = locale.homeScreen;

  const handleStartOver = () => {
    fadeOutThen(() => {
      reset();
      router.replace("/");
    }, "forward");
  };

  return (
    <Animated.View style={[styles.screen, fadeStyle]}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.contentArea}>
          <View style={styles.appGreetingSection}>
            <AppText variant="display">{title}</AppText>
            <AppText
              color={COLORS.textAlt}
              style={{ textAlign: "center" }}
              variant="bodyCompact"
            >
              {text}
            </AppText>
          </View>
        </View>
        <AppButton
          label={startOver}
          disabled={isTransitioning}
          onPress={handleStartOver}
        />
      </SafeAreaView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
  },
  appGreetingSection: { gap: 24, alignItems: "center" },
});
