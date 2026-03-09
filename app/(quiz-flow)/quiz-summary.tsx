import { HEADER_HEIGHT, QuizSummary, ScreenWithBottomAction, SpinningBuffer } from "@components";
import { COLORS, PROGRESS_BAR_COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { isDebugSkipQuizToSummaryEnabled } from "@/config/featureFlags";
import { useGlow, useQuizHeaderStore, useQuizStore } from "@/stores";
import { useQuizQuestions, useScreenTransition } from "@/hooks";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import { showErrorToast } from "@/utils/toast";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function QuizSummaryScreen() {
  const { questions, isLoading, isError, error } = useQuizQuestions();
  const answers = useQuizStore((s) => s.answers);
  const setHasStartedJourney = useQuizStore((s) => s.setHasStartedJourney);
  const { setGlowTarget } = useGlow();
  const setHeaderState = useQuizHeaderStore((s) => s.setState);
  const router = useRouter();
  const [keepHeaderVisibleOnExit, setKeepHeaderVisibleOnExit] = useState(false);
  const { isVisible, entering, exiting, fadeOutThen, isTransitioning } = useScreenTransition();
  const shouldHideBackArrow = isDebugSkipQuizToSummaryEnabled();

  const variant = getSummaryVariant(answers);

  useEffect(() => {
    setGlowTarget(1, variant);
  }, [setGlowTarget, variant]);

  useEffect(() => {
    if (isError && error) {
      showErrorToast(error.message);
    }
  }, [isError, error]);

  const handleBackPress = useCallback(() => {
    setGlowTarget(0);
    setKeepHeaderVisibleOnExit(true);
    fadeOutThen(() => router.replace("/health-quiz"), "backward");
  }, [setGlowTarget, fadeOutThen, router]);

  const handleStartJourney = useCallback(() => {
    setHasStartedJourney(true);
    setGlowTarget(0);
    setKeepHeaderVisibleOnExit(false);
    fadeOutThen(() => router.replace("/home"), "forward");
  }, [setHasStartedJourney, setGlowTarget, fadeOutThen, router]);

  useLayoutEffect(() => {
    setHeaderState({
      onBackPress: handleBackPress,
      hideBackButton: shouldHideBackArrow,
      isBackDisabled: isTransitioning,
      isVisible: isVisible || keepHeaderVisibleOnExit,
      progress: 1,
    });
  }, [
    setHeaderState,
    handleBackPress,
    shouldHideBackArrow,
    isTransitioning,
    isVisible,
    keepHeaderVisibleOnExit,
  ]);

  return (
    <View style={styles.screen}>
      {isVisible ? (
        <Animated.View style={styles.animatedContent} entering={entering} exiting={exiting}>
          <ScreenWithBottomAction
            action={{
              label: locale.summary.labels.startJourney,
              disabled: isTransitioning,
              fillColor: PROGRESS_BAR_COLORS.summary[variant],
              onPress: handleStartJourney,
            }}
            edges={["bottom"]}
            contentStyle={styles.contentNoHorizontalPadding}
            actionPointerEventsDisabled={isTransitioning}
            actionKeyboardAvoiding
            footerStyle={styles.fixedFooter}
          >
            <KeyboardAvoidingView
              style={styles.contentArea}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? HEADER_HEIGHT / 2 : 0}
            >
              {isLoading || !questions ? (
                <View style={styles.bufferingWrapper}>
                  <SpinningBuffer size={40} color={COLORS.text} />
                </View>
              ) : (
                <QuizSummary questions={questions} />
              )}
            </KeyboardAvoidingView>
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
  animatedContent: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
    marginTop: -HEADER_HEIGHT,
    paddingTop: HEADER_HEIGHT,
    alignItems: "stretch",
  },
  contentNoHorizontalPadding: {
    paddingHorizontal: 0,
  },
  fixedFooter: {
    backgroundColor: COLORS.background,
    paddingTop: 8,
  },
  bufferingWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});
