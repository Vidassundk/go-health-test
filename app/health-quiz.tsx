import { QuizFlow, QuizSummary } from "@/components/quiz";
import QuizHeader, { HEADER_HEIGHT } from "@/components/QuizHeader";
import { SpinningBuffer } from "@/components/SpinningBuffer";
import { COLORS } from "@/constants/colors";
import type { QuizAnswers } from "@/hooks/useQuizEngine";
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
  const [showSummary, setShowSummary] = useState(false);
  const [submittedAnswers, setSubmittedAnswers] = useState<QuizAnswers | null>(
    null
  );
  const {
    fadeStyle: sectionFadeStyle,
    transitionTo,
    isTransitioning: isSectionTransitioning,
  } = useSectionFade();
  const engine = useQuizEngine(questions, {
    onSubmit: (answers) => {
      setSubmittedAnswers(answers);
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

  const handleBackPress = useCallback(() => {
    if (showSummary) {
      transitionTo(() => setShowSummary(false), "forward");
    } else if (engine.isFirst) {
      fadeOutThen(() => router.back(), "forward");
    } else {
      transitionTo(engine.goBack, "forward");
    }
  }, [
    showSummary,
    engine.isFirst,
    engine.goBack,
    fadeOutThen,
    router,
    transitionTo,
  ]);

  return (
    <Animated.View style={[styles.screen, fadeStyle]}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <QuizHeader
          onBackPress={handleBackPress}
          progress={
            showSummary
              ? 1
              : engine.totalSteps > 0
              ? (engine.currentIndex + 1) / engine.totalSteps
              : 0
          }
          isBackDisabled={isTransitioning || isSectionTransitioning}
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
          ) : showSummary && submittedAnswers ? (
            <Animated.View style={[styles.quizContent, sectionFadeStyle]}>
              <QuizSummary answers={submittedAnswers} />
            </Animated.View>
          ) : engine.currentQuestion ? (
            <Animated.View style={[styles.quizContent, sectionFadeStyle]}>
              <QuizFlow
                question={engine.currentQuestion}
                value={engine.answers[engine.currentQuestion.key]}
                setAnswer={engine.setAnswer}
                isFirst={engine.isFirst}
                isLast={engine.isLast}
                currentStep={engine.currentIndex + 1}
                totalSteps={engine.totalSteps}
                onBack={() => transitionTo(engine.goBack, "back")}
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
