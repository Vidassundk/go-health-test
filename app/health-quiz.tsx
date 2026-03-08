import { QuizFlow, QuizSummary } from "@/components/quiz";
import QuizHeader, { HEADER_HEIGHT } from "@/components/QuizHeader";
import { SpinningBuffer } from "@/components/SpinningBuffer";
import { WheelPickerReadyInit } from "@/components/WheelPickerReadyInit";
import {
  TRANSITION_ENTER_MS,
  TRANSITION_EXIT_MS,
  TRANSITION_INITIAL_DELAY_MS,
} from "@/constants/animations";
import { COLORS } from "@/constants/colors";
import { useGlowContext } from "@/contexts/GlowContext";
import { useQuizEngine, type QuizAnswers } from "@/hooks/useQuizEngine";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import { useScreenFade } from "@/hooks/useScreenFade";
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
        return (
          <QuizSummary
            questions={questions}
            isTransitioning={isTransitioning}
            onStartJourney={() => {
              setGlowTarget(0);
              fadeOutThen(() => router.push("/home"), "forward");
            }}
          />
        );
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
    ]
  );

  useEffect(() => {
    if (isError && error) {
      showErrorToast(error.message);
    }
  }, [isError, error]);

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
  },
});
