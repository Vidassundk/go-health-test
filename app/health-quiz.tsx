import { QuizFlow, QuizSummary } from "@/components/quiz";
import QuizHeader, { HEADER_HEIGHT } from "@/components/QuizHeader";
import { WheelPickerReadyInit } from "@/components/WheelPickerReadyInit";
import { SpinningBuffer } from "@/components/SpinningBuffer";
import { COLORS } from "@/constants/colors";
import { useGlowContext } from "@/contexts/GlowContext";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import { useQuizEngine } from "@/hooks/useQuizEngine";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import { useScreenFade } from "@/hooks/useScreenFade";
import { useSectionFade } from "@/hooks/useSectionFade";
import { showErrorToast } from "@/utils/toast";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizScreen() {
  const { questions, isLoading, isError, error } = useQuizQuestions();
  const { setGlowTarget } = useGlowContext();
  const [showSummary, setShowSummary] = useState(false);
  const {
    fadeStyle: sectionFadeStyle,
    transitionTo,
    interruptAndRun,
    isTransitioning: isSectionTransitioning,
  } = useSectionFade();
  const engine = useQuizEngine(questions, {
    onSubmit: (answers) => {
      setGlowTarget(1, getSummaryVariant(answers));
      transitionTo(() => setShowSummary(true), "back");
    },
  });
  const router = useRouter();
  const { fadeStyle, fadeOutThen, isTransitioning } = useScreenFade();

  useEffect(() => {
    if (isError && error) {
      showErrorToast(error.message);
    }
  }, [isError, error]);

  useEffect(() => {
    return () => setGlowTarget(0);
  }, [setGlowTarget]);

  const handleBackPress = useCallback(() => {
    if (showSummary) {
      setGlowTarget(0);
      transitionTo(() => setShowSummary(false), "forward");
    } else if (engine.isFirst) {
      fadeOutThen(() => router.back(), "forward");
    } else if (isSectionTransitioning) {
      interruptAndRun(engine.goBack);
    } else {
      transitionTo(engine.goBack, "forward");
    }
  }, [
    showSummary,
    setGlowTarget,
    engine.isFirst,
    engine.goBack,
    fadeOutThen,
    router,
    transitionTo,
    interruptAndRun,
    isSectionTransitioning,
  ]);

  return (
    <Animated.View style={[styles.screen, fadeStyle]}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <WheelPickerReadyInit />
        <QuizHeader
          onBackPress={handleBackPress}
          progress={
            engine.totalSteps > 0
              ? showSummary
                ? (engine.totalSteps + 1) / (engine.totalSteps + 1)
                : (engine.currentIndex + 1) / (engine.totalSteps + 1)
              : 0
          }
          isBackDisabled={isTransitioning}
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
          ) : showSummary && questions ? (
            <Animated.View style={[styles.quizContent, sectionFadeStyle]}>
              <QuizSummary questions={questions} />
            </Animated.View>
          ) : engine.currentQuestion ? (
            <Animated.View style={[styles.quizContent, sectionFadeStyle]}>
              <QuizFlow
                question={engine.currentQuestion}
                isLast={engine.isLast}
                setAnswer={engine.setAnswer}
                canProceed={engine.isCurrentStepValid}
                onNext={() =>
                  engine.isLast
                    ? engine.goNext()
                    : transitionTo(engine.goNext, "back")
                }
                isTransitioning={isSectionTransitioning}
              />
            </Animated.View>
          ) : (
            <View />
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
  },
  bufferingWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
