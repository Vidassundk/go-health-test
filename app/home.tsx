import { AppText, ScreenWithBottomAction } from "@components";
import { COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { useGlow, useQuizStore } from "@/stores";
import { useScreenTransition } from "@/hooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function HomeScreen() {
  const router = useRouter();
  const reset = useQuizStore((s) => s.reset);
  const { setHomeBackgroundEnabled } = useGlow();
  const { isVisible, entering, exiting, fadeOutThen, isTransitioning } = useScreenTransition();
  const { title, text, startOver } = locale.homeScreen;

  useEffect(() => {
    setHomeBackgroundEnabled(true);
  }, [setHomeBackgroundEnabled]);

  const handleStartOver = () => {
    setHomeBackgroundEnabled(false);
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
