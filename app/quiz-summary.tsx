import {
  HEADER_HEIGHT,
  QuizHeader,
  QuizSummary,
  ScreenWithBottomAction,
  SpinningBuffer,
} from "@components";
import { COLORS, PROGRESS_BAR_COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { isDebugSkipQuizToSummaryEnabled } from "@/config/featureFlags";
import { useGlowContext } from "@/contexts/GlowContext";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import { useScreenTransition } from "@/hooks/useScreenTransition";
import { useQuizStore } from "@/stores/quizStore";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import { showErrorToast } from "@/utils/toast";
import { useRouter } from "expo-router";
import { useCallback, useEffect } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

export default function QuizSummaryScreen() {
  const { questions, isLoading, isError, error } = useQuizQuestions();
  const answers = useQuizStore((s) => s.answers);
  const setHasStartedJourney = useQuizStore((s) => s.setHasStartedJourney);
  const { setGlowTarget } = useGlowContext();
  const router = useRouter();
  const { isVisible, entering, exiting, fadeOutThen, isTransitioning } =
    useScreenTransition();
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
    fadeOutThen(() => router.back(), "backward");
  }, [setGlowTarget, fadeOutThen, router]);

  const handleStartJourney = useCallback(() => {
    setHasStartedJourney(true);
    setGlowTarget(0);
    fadeOutThen(() => router.replace("/home"), "forward");
  }, [setHasStartedJourney, setGlowTarget, fadeOutThen, router]);

  return (
    <View style={styles.screen}>
      {isVisible ? (
        <Animated.View style={styles.screen} entering={entering} exiting={exiting}>
          <ScreenWithBottomAction
            action={{
              label: locale.summary.labels.startJourney,
              disabled: isTransitioning,
              fillColor: PROGRESS_BAR_COLORS.summary[variant],
              onPress: handleStartJourney,
            }}
            contentStyle={styles.contentNoHorizontalPadding}
            actionPointerEventsDisabled={isTransitioning}
            actionKeyboardAvoiding
            footerStyle={styles.fixedFooter}
          >
            <View style={styles.headerWrapper}>
              <QuizHeader
                onBackPress={handleBackPress}
                hideBackButton={shouldHideBackArrow}
                isBackDisabled={isTransitioning}
                progress={1}
              />
            </View>
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
  contentArea: {
    flex: 1,
    marginTop: -HEADER_HEIGHT,
    paddingTop: HEADER_HEIGHT,
    alignItems: "stretch",
  },
  contentNoHorizontalPadding: {
    paddingHorizontal: 0,
  },
  headerWrapper: {
    paddingHorizontal: 20,
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
