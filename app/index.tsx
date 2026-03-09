import { isDebugSkipQuizToSummaryEnabled } from "@/config/featureFlags";
import { COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { useScreenTransition } from "@/hooks";
import { useQuizStore } from "@/stores";
import { AppText, ScreenWithBottomAction } from "@components";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function LandingScreen() {
  const router = useRouter();
  const hasHydrated = useQuizStore((s) => s.hasHydrated);
  const hasStartedJourney = useQuizStore((s) => s.hasStartedJourney);
  const { isVisible, entering, exiting, fadeOutThen, isTransitioning } = useScreenTransition();
  const shouldSkipQuizToSummary = isDebugSkipQuizToSummaryEnabled();

  useEffect(() => {
    if (hasHydrated && hasStartedJourney) {
      router.replace("/home");
    }
  }, [hasHydrated, hasStartedJourney, router]);

  if (!hasHydrated || hasStartedJourney) {
    return null;
  }

  return (
    <View style={styles.screen}>
      {isVisible ? (
        <Animated.View style={styles.screen} entering={entering} exiting={exiting}>
          <ScreenWithBottomAction
            action={{
              label: locale.common.next,
              disabled: isTransitioning,
              onPress: () =>
                fadeOutThen(
                  () => router.replace(shouldSkipQuizToSummary ? "/quiz-summary" : "/health-quiz"),
                  "forward"
                ),
            }}
          >
            <View style={styles.contentArea}>
              <View style={styles.appGreetingSection}>
                <AppText variant="display">{locale.home.greeting}</AppText>
                <AppText
                  color={COLORS.textAlt}
                  style={{ textAlign: "center" }}
                  variant="bodyCompact"
                >
                  {locale.home.subtext}
                </AppText>
              </View>
            </View>
          </ScreenWithBottomAction>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
    justifyContent: "center",
  },
  appGreetingSection: { gap: 24, alignItems: "center" },
});
