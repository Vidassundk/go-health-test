import { QuizFlow, QuizSummary } from "@/components/quiz";
import QuizHeader, { HEADER_HEIGHT } from "@/components/QuizHeader";
import ScreenWithBottomAction from "@/components/ScreenWithBottomAction";
import { SpinningBuffer } from "@/components/SpinningBuffer";
import { WheelPickerReadyInit } from "@/components/WheelPickerReadyInit";
import {
  TRANSITION_ENTER_MS,
  TRANSITION_EXIT_MS,
  TRANSITION_INITIAL_DELAY_MS,
} from "@/constants/animations";
import { COLORS } from "@/constants/colors";
import { useGlowContext } from "@/contexts/GlowContext";
import { useQuizBottomAction } from "@/hooks/useQuizBottomAction";
import { useQuizEngine, type QuizAnswers } from "@/hooks/useQuizEngine";
import { useQuizNavigationFlow } from "@/hooks/useQuizNavigationFlow";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import {
  getSectionKey,
  type SectionSnapshot,
  useQuizSectionSnapshot,
} from "@/hooks/useQuizSectionSnapshot";
import { useScreenTransition } from "@/hooks/useScreenTransition";
import { useQuizStore } from "@/stores/quizStore";
import {
  selectWheelPickerShowingBuffer,
  useWheelPickerStore,
} from "@/stores/wheelPickerStore";
import { showErrorToast } from "@/utils/toast";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

export default function QuizScreen() {
  const { questions, isLoading, isError, error } = useQuizQuestions();
  const { setGlowTarget } = useGlowContext();
  const [showSummary, setShowSummary] = useState(false);
  const [pendingSubmitAnswers, setPendingSubmitAnswers] =
    useState<QuizAnswers | null>(null);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const answers = useQuizStore((s) => s.answers);
  const isWheelPickerShowingBuffer = useWheelPickerStore(
    selectWheelPickerShowingBuffer
  );
  // Reanimated layout animation test – entering/exiting
  const engine = useQuizEngine(questions, {
    onSubmit: (answers) => {
      setPendingSubmitAnswers(answers);
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
  const { isVisible, entering, exiting, fadeOutThen, isTransitioning } =
    useScreenTransition();

  const currentSection = useQuizSectionSnapshot({
    showSummary,
    questions,
    currentQuestion,
    isLast,
    isCurrentStepValid,
  });

  const startSectionTransition = useCallback((action: () => void) => {
    action();
  }, []);

  const navigationFlow = useQuizNavigationFlow({
    setGlowTarget,
    startSectionTransition,
    showSummary,
    setShowSummary,
    pendingSubmitAnswers,
    setPendingSubmitAnswers,
    isFirst,
    goBack,
    navigateToHome: () => fadeOutThen(() => router.push("/home"), "forward"),
    navigateToIntro: () => fadeOutThen(() => router.replace("/"), "forward"),
  });
  const { onSummaryActionPress, onBackPress } = navigationFlow;

  const bottomAction = useQuizBottomAction({
    section: currentSection,
    answers,
    isTransitioning,
    isWheelPickerShowingBuffer,
    goNext,
    startSectionTransition,
    setSubmitAttempted,
    onSummaryActionPress,
  });

  const renderSection = useCallback(
    (section: SectionSnapshot) => {
      if (section.kind === "summary") {
        if (!questions) {
          return <View />;
        }
        return <QuizSummary questions={questions} />;
      }

      if (section.kind === "question") {
        return (
          <QuizFlow
            question={section.question}
            isLast={section.isLast}
            setAnswer={setAnswer}
            onNext={() =>
              section.isLast ? goNext() : startSectionTransition(goNext)
            }
            isTransitioning={false}
            submitAttempted={submitAttempted}
            onSubmitAttempt={() => setSubmitAttempted(true)}
          />
        );
      }

      return <View />;
    },
    [questions, setAnswer, goNext, startSectionTransition, submitAttempted]
  );

  const currentSectionKey = getSectionKey(currentSection);

  useEffect(() => {
    if (isError && error) {
      showErrorToast(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    setSubmitAttempted(false);
  }, [currentSectionKey]);

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
                progress={
                  totalSteps > 0
                    ? showSummary
                      ? (totalSteps + 1) / (totalSteps + 1)
                      : (currentIndex + 1) / (totalSteps + 1)
                    : 0
                }
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
                      key={currentSection.kind === "summary" ? "summary" : currentSectionKey}
                      entering={FadeInRight.duration(TRANSITION_ENTER_MS).delay(
                        TRANSITION_INITIAL_DELAY_MS
                      )}
                      exiting={FadeOutLeft.duration(TRANSITION_EXIT_MS)}
                      style={styles.sectionWrapper}
                    >
                      {renderSection(currentSection)}
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
