import AppButton from "@/components/AppButton";
import { QuizFlow, QuizSummary } from "@/components/quiz";
import QuizHeader, { HEADER_HEIGHT } from "@/components/QuizHeader";
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
import { SafeAreaView } from "react-native-safe-area-context";

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
  const router = useRouter();
  const { fadeStyle, fadeOutThen, isTransitioning } = useScreenFade();

  const currentSection = useMemo<SectionSnapshot>(() => {
    if (showSummary && questions) {
      return { kind: "summary" };
    }
    if (engine.currentQuestion) {
      return {
        kind: "question",
        question: engine.currentQuestion,
        isLast: engine.isLast,
        canProceed: engine.isCurrentStepValid,
      };
    }
    return { kind: "empty" };
  }, [
    showSummary,
    questions,
    engine.currentQuestion,
    engine.isLast,
    engine.isCurrentStepValid,
  ]);

  const startSectionTransition = useCallback((action: () => void) => {
    action();
  }, []);

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
            setAnswer={engine.setAnswer}
            canProceed={section.canProceed}
            onNext={() =>
              section.isLast
                ? engine.goNext()
                : startSectionTransition(engine.goNext)
            }
            isTransitioning={false}
            submitAttempted={submitAttempted}
            onSubmitAttempt={() => setSubmitAttempted(true)}
          />
        );
      }

      return <View />;
    },
    [
      questions,
      setGlowTarget,
      fadeOutThen,
      router,
      engine.setAnswer,
      engine.goNext,
      startSectionTransition,
      isTransitioning,
      submitAttempted,
    ]
  );

  useEffect(() => {
    if (isError && error) {
      showErrorToast(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    setSubmitAttempted(false);
  }, [
    currentSection.kind === "question" ? currentSection.question.key : "empty",
  ]);

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
    } else if (engine.isFirst) {
      fadeOutThen(() => router.replace("/"), "forward");
    } else {
      startSectionTransition(engine.goBack);
    }
  }, [
    showSummary,
    setGlowTarget,
    startSectionTransition,
    engine.isFirst,
    engine.goBack,
    fadeOutThen,
    router,
  ]);

  return (
    <Animated.View style={[styles.screen, fadeStyle]}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <WheelPickerReadyInit />
        <QuizHeader
          onBackPress={handleBackPress}
          isBackDisabled={isTransitioning}
          progress={
            engine.totalSteps > 0
              ? showSummary
                ? (engine.totalSteps + 1) / (engine.totalSteps + 1)
                : (engine.currentIndex + 1) / (engine.totalSteps + 1)
              : 0
          }
        />
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
              <View
                style={styles.fixedFooter}
                pointerEvents={isTransitioning ? "none" : "auto"}
              >
                {currentSection.kind === "summary" && (
                  <AppButton
                    label={locale.summary.labels.startJourney}
                    disabled={isTransitioning}
                    fillColor={
                      PROGRESS_BAR_COLORS.summary[
                        getSummaryVariant(answers)
                      ]
                    }
                    onPress={() => {
                      setGlowTarget(0);
                      fadeOutThen(() => router.push("/home"), "forward");
                    }}
                  />
                )}
                {currentSection.kind === "question" && (
                  <AppButton
                    label={
                      currentSection.isLast ? "Submit" : "Next"
                    }
                    onPress={() => {
                      setSubmitAttempted(true);
                      if (currentSection.isLast) {
                        engine.goNext();
                      } else {
                        startSectionTransition(engine.goNext);
                      }
                    }}
                    disabled={
                      currentSection.question.type === "credentials"
                        ? false
                        : !currentSection.canProceed ||
                          ((currentSection.question.type === "age" ||
                            currentSection.question.type === "weight") &&
                            isWheelPickerShowingBuffer)
                    }
                  />
                )}
              </View>
            </View>
          )}
        </KeyboardAvoidingView>
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
    marginTop: -HEADER_HEIGHT,
    paddingTop: HEADER_HEIGHT,
    alignItems: "stretch",
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
