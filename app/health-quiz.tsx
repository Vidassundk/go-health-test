import {
  TRANSITION_ENTER_MS,
  TRANSITION_EXIT_MS,
  TRANSITION_INITIAL_DELAY_MS,
} from "@/constants/animations";
import { COLORS } from "@/constants/colors";
import { useQuizBottomAction, useQuizEngine, useQuizQuestions, useScreenTransition } from "@/hooks";
import { selectWheelPickerShowingBuffer, useGlow, useWheelPickerStore } from "@/stores";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import { showErrorToast } from "@/utils/toast";
import {
  HEADER_HEIGHT,
  QuizFlow,
  QuizHeader,
  ScreenWithBottomAction,
  SpinningBuffer,
  WheelPickerReadyInit,
} from "@components";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export default function QuizScreen() {
  const { questions, isLoading, isError, error } = useQuizQuestions();
  const { setGlowTarget } = useGlow();
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const isWheelPickerShowingBuffer = useWheelPickerStore(selectWheelPickerShowingBuffer);

  const engine = useQuizEngine(questions, {
    onSubmit: (answers) => {
      setGlowTarget(1, getSummaryVariant(answers));
      fadeOutThen(() => router.push("/quiz-summary"), "forward");
    },
  });
  const {
    currentQuestion,
    isLast,
    isCurrentStepValid,
    isFirst,
    totalSteps,
    currentIndex,
    setAnswer,
    goNext,
    goBack,
  } = engine;
  const router = useRouter();
  const { isVisible, entering, exiting, fadeOutThen, isTransitioning } = useScreenTransition();

  const startSectionTransition = useCallback((action: () => void) => {
    action();
  }, []);

  const bottomAction = useQuizBottomAction({
    currentQuestion,
    isLast,
    isCurrentStepValid,
    isWheelPickerShowingBuffer,
    goNext,
    startSectionTransition,
    setSubmitAttempted,
  });

  const currentSectionKey = currentQuestion?.key ?? "empty";

  const handleSectionSubmitAttempt = useCallback(() => {
    setSubmitAttempted(true);
  }, []);

  useEffect(() => {
    if (isError && error) {
      showErrorToast(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    setSubmitAttempted(false);
  }, [currentSectionKey]);

  useEffect(() => {
    return () => setGlowTarget(0);
  }, [setGlowTarget]);

  const onBackPress = useCallback(() => {
    if (isFirst) {
      fadeOutThen(() => router.replace("/"), "forward");
      return;
    }
    startSectionTransition(goBack);
  }, [isFirst, fadeOutThen, router, startSectionTransition, goBack]);

  return (
    <View style={styles.screen}>
      {isVisible ? (
        <Animated.View style={styles.screen} entering={entering} exiting={exiting}>
          <ScreenWithBottomAction
            action={bottomAction}
            contentStyle={styles.contentNoHorizontalPadding}
            actionPointerEventsDisabled={isTransitioning}
            actionKeyboardAvoiding
            footerStyle={styles.fixedFooter}
          >
            <WheelPickerReadyInit />
            <View style={styles.headerWrapper}>
              <QuizHeader
                onBackPress={onBackPress}
                isBackDisabled={isTransitioning}
                progress={totalSteps > 0 ? (currentIndex + 1) / totalSteps : 0}
              />
            </View>
            <KeyboardAvoidingView
              style={styles.contentArea}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? HEADER_HEIGHT / 2 : 0}
            >
              {isLoading ? (
                <View style={styles.bufferingWrapper}>
                  <SpinningBuffer size={40} color={COLORS.text} />
                </View>
              ) : (
                <View style={styles.quizLayout}>
                  <View style={styles.quizContent}>
                    <Animated.View
                      key={currentSectionKey}
                      entering={FadeInRight.duration(TRANSITION_ENTER_MS).delay(
                        TRANSITION_INITIAL_DELAY_MS
                      )}
                      exiting={FadeOutLeft.duration(TRANSITION_EXIT_MS)}
                      style={styles.sectionWrapper}
                    >
                      {currentQuestion ? (
                        <QuizFlow
                          question={currentQuestion}
                          isLast={isLast}
                          setAnswer={setAnswer}
                          onNext={() => (isLast ? goNext() : startSectionTransition(goNext))}
                          isTransitioning={false}
                          submitAttempted={submitAttempted}
                          onSubmitAttempt={handleSectionSubmitAttempt}
                        />
                      ) : (
                        <View />
                      )}
                    </Animated.View>
                  </View>
                </View>
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
  quizLayout: {
    flex: 1,
    minHeight: 0,
  },
  quizContent: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
  },
  sectionWrapper: {
    flex: 1,
  },
  fixedFooter: {
    backgroundColor: COLORS.background,
    paddingTop: 8,
  },
  bufferingWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
