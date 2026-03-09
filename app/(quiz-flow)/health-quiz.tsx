import {
  TRANSITION_ENTER_MS,
  TRANSITION_EXIT_MS,
  TRANSITION_INITIAL_DELAY_MS,
} from "@/constants/animations";
import { COLORS } from "@/constants/colors";
import {
  useQuizBottomAction,
  useQuizEngine,
  useQuizHeaderController,
  useQuizQuestions,
  useScreenTransition,
} from "@/hooks";
import { selectWheelPickerShowingBuffer, useGlow, useWheelPickerStore } from "@/stores";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import { showErrorToast } from "@/utils/toast";
import { QuizFlow, QuizFlowScreenShell, SpinningBuffer, WheelPickerReadyInit } from "@components";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export default function QuizScreen() {
  const { questions, isLoading, isError, error } = useQuizQuestions();
  const { setGlowTarget } = useGlow();
  const [submitAttempted, setSubmitAttempted] = useState(false);
  // Keeps header visible during forward navigation so top chrome does not flicker out.
  const [keepHeaderVisibleOnExit, setKeepHeaderVisibleOnExit] = useState(false);
  const isWheelPickerShowingBuffer = useWheelPickerStore(selectWheelPickerShowingBuffer);

  // Quiz engine owns step visibility, validation, branching, and submit behavior.
  const engine = useQuizEngine(questions, {
    onSubmit: (answers) => {
      // Set summary glow variant before route change so the next screen animates from correct state.
      setGlowTarget(1, getSummaryVariant(answers));
      setKeepHeaderVisibleOnExit(true);
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

  // Centralized CTA rules (label, disabled state, submit-vs-next behavior).
  const bottomAction = useQuizBottomAction({
    currentQuestion,
    isLast,
    isCurrentStepValid,
    isWheelPickerShowingBuffer,
    goNext,
    setSubmitAttempted,
  });

  const currentSectionKey = currentQuestion?.key;

  // Used by credentials fields to reveal validation feedback after a submit attempt.
  const handleSectionSubmitAttempt = useCallback(() => {
    setSubmitAttempted(true);
  }, []);

  // Surface query failures as toasts.
  useEffect(() => {
    if (isError && error) {
      showErrorToast(error.message);
    }
  }, [isError, error]);

  // Reset per-section submit attempt state when question changes.
  useEffect(() => {
    setSubmitAttempted(false);
  }, [currentSectionKey]);

  // Ensure glow returns to neutral when leaving this screen unexpectedly.
  useEffect(() => {
    return () => setGlowTarget(0);
  }, [setGlowTarget]);

  // First step back exits to landing; otherwise move to previous visible question.
  const onBackPress = useCallback(() => {
    if (isFirst) {
      setKeepHeaderVisibleOnExit(false);
      fadeOutThen(() => router.replace("/"), "forward");
      return;
    }
    goBack();
  }, [isFirst, fadeOutThen, router, goBack]);

  // Quiz-route header is controlled by store so top layout stays persistent across screens.
  useQuizHeaderController({
    onBackPress,
    hideBackButton: false,
    isBackDisabled: isTransitioning,
    isVisible: isVisible || keepHeaderVisibleOnExit,
    progress: totalSteps > 0 ? (currentIndex + 1) / (totalSteps + 1) : 0,
  });

  return (
    <QuizFlowScreenShell
      isVisible={isVisible}
      entering={entering}
      exiting={exiting}
      action={bottomAction}
      isTransitioning={isTransitioning}
      beforeContent={<WheelPickerReadyInit />}
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
                  onNext={goNext}
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
    </QuizFlowScreenShell>
  );
}

const styles = StyleSheet.create({
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
  bufferingWrapper: {
    alignItems: "center",
    justifyContent: "center",
    ...StyleSheet.absoluteFillObject,
  },
});
