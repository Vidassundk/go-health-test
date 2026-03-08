import { QuizFlow, QuizSummary } from "@/components/quiz";
import QuizHeader, { HEADER_HEIGHT } from "@/components/QuizHeader";
import ScreenWithBottomAction, {
  type BottomActionConfig,
} from "@/components/ScreenWithBottomAction";
import { SpinningBuffer } from "@/components/SpinningBuffer";
import { WheelPickerReadyInit } from "@/components/WheelPickerReadyInit";
import {
  TRANSITION_ENTER_MS,
  TRANSITION_EXIT_MS,
  TRANSITION_INITIAL_DELAY_MS,
} from "@/constants/animations";
import { COLORS, PROGRESS_BAR_COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { useGlowContext } from "@/contexts/GlowContext";
import { useQuizEngine, type QuizAnswers } from "@/hooks/useQuizEngine";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import { useScreenFade } from "@/hooks/useScreenFade";
import { useQuizStore } from "@/stores/quizStore";
import {
  selectWheelPickerShowingBuffer,
  useWheelPickerStore,
} from "@/stores/wheelPickerStore";
import type { QuizQuestion } from "@/types/quiz";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import { showErrorToast } from "@/utils/toast";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";

type SectionSnapshot =
  | { kind: "summary" }
  | {
      kind: "question";
      question: QuizQuestion;
      isLast: boolean;
      canProceed: boolean;
    }
  | { kind: "empty" };

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
  const { fadeStyle, fadeOutThen, isTransitioning } = useScreenFade();

  const currentSection = useMemo<SectionSnapshot>(() => {
    if (showSummary && questions) {
      return { kind: "summary" };
    }
    if (currentQuestion) {
      return {
        kind: "question",
        question: currentQuestion,
        isLast,
        canProceed: isCurrentStepValid,
      };
    }
    return { kind: "empty" };
  }, [showSummary, questions, currentQuestion, isLast, isCurrentStepValid]);

  const startSectionTransition = useCallback((action: () => void) => {
    action();
  }, []);

  const bottomAction = useMemo<BottomActionConfig | null>(() => {
    if (currentSection.kind === "summary") {
      return {
        label: locale.summary.labels.startJourney,
        disabled: isTransitioning,
        fillColor: PROGRESS_BAR_COLORS.summary[getSummaryVariant(answers)],
        onPress: () => {
          setGlowTarget(0);
          fadeOutThen(() => router.push("/home"), "forward");
        },
      };
    }

    if (currentSection.kind === "question") {
      return {
        label: currentSection.isLast ? "Submit" : "Next",
        onPress: () => {
          setSubmitAttempted(true);
          if (currentSection.isLast) {
            goNext();
          } else {
            startSectionTransition(goNext);
          }
        },
        disabled:
          currentSection.question.type === "credentials"
            ? false
            : !currentSection.canProceed ||
              ((currentSection.question.type === "age" ||
                currentSection.question.type === "weight") &&
                isWheelPickerShowingBuffer),
      };
    }

    return null;
  }, [
    currentSection,
    isTransitioning,
    answers,
    setGlowTarget,
    fadeOutThen,
    router,
    goNext,
    startSectionTransition,
    isWheelPickerShowingBuffer,
  ]);

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
            canProceed={section.canProceed}
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

  const currentSectionKey =
    currentSection.kind === "question" ? currentSection.question.key : "empty";

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

  useEffect(() => {
    if (!pendingSubmitAnswers) {
      return;
    }

    setGlowTarget(1, getSummaryVariant(pendingSubmitAnswers));
    startSectionTransition(() => setShowSummary(true));
    setPendingSubmitAnswers(null);
  }, [pendingSubmitAnswers, setGlowTarget, startSectionTransition]);

  const handleBackPress = useCallback(() => {
    if (showSummary) {
      setGlowTarget(0);
      startSectionTransition(() => setShowSummary(false));
    } else if (isFirst) {
      fadeOutThen(() => router.replace("/"), "forward");
    } else {
      startSectionTransition(goBack);
    }
  }, [
    showSummary,
    setGlowTarget,
    startSectionTransition,
    isFirst,
    goBack,
    fadeOutThen,
    router,
  ]);

  return (
    <Animated.View style={[styles.screen, fadeStyle]}>
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
            onBackPress={handleBackPress}
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
                  key={
                    currentSection.kind === "summary"
                      ? "summary"
                      : currentSection.kind === "question"
                      ? currentSection.question.key
                      : "empty"
                  }
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
