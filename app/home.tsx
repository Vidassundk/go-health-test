import AppText from "@/components/AppText";
import ScreenWithBottomAction from "@/components/ScreenWithBottomAction";
import { COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { useScreenTransition } from "@/hooks/useScreenTransition";
import { useQuizStore } from "@/stores/quizStore";
import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function HomeScreen() {
  const router = useRouter();
  const reset = useQuizStore((s) => s.reset);
  const { isVisible, entering, exiting, fadeOutThen, isTransitioning } =
    useScreenTransition();
  const { title, text, startOver } = locale.homeScreen;

  const handleStartOver = () => {
    fadeOutThen(() => {
      reset();
      router.replace("/");
    }, "forward");
  };

  return (
    <View style={styles.screen}>
      {isVisible ? (
        <Animated.View style={styles.screen} entering={entering} exiting={exiting}>
          <ScreenWithBottomAction
            action={{
              label: startOver,
              disabled: isTransitioning,
              onPress: handleStartOver,
            }}
          >
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
