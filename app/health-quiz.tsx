import Header, { HEADER_HEIGHT } from "@/components/Header";
import IconButton from "@/components/IconButton";
import { ArrowIcon } from "@/components/Icons/ArrowIcon";
import { QuizFlow } from "@/components/quiz";
import { SpinningBuffer } from "@/components/SpinningBuffer";
import { COLORS } from "@/constants/colors";
import { useQuizEngine } from "@/hooks/useQuizEngine";
import { useQuizQuestions } from "@/hooks/useQuizQuestions";
import { useScreenFade } from "@/hooks/useScreenFade";
import { showErrorToast } from "@/utils/toast";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizScreen() {
  const { questions, isLoading, isError, error } = useQuizQuestions();
  const engine = useQuizEngine(questions, {
    onSubmit: (answers) => {
      console.log("Quiz submitted:", answers);
    },
  });
  const router = useRouter();
  const { fadeStyle, fadeOutThen, isTransitioning } = useScreenFade();

  useEffect(() => {
    if (isError && error) {
      showErrorToast(error.message);
    }
  }, [isError, error]);

  return (
    <Animated.View style={[styles.screen, fadeStyle]}>
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <Header>
          <IconButton
            icon={<ArrowIcon size={22} color={COLORS.text} />}
            onPress={() => {
              if (isTransitioning) {
                return;
              }
              fadeOutThen(() => router.back(), "forward");
            }}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          />
        </Header>
        <View style={styles.contentArea}>
          {isLoading ? (
            <View style={styles.bufferingWrapper}>
              <SpinningBuffer size={40} color={COLORS.text} />
            </View>
          ) : engine.currentQuestion ? (
            <QuizFlow
              question={engine.currentQuestion}
              value={engine.answers[engine.currentQuestion.key]}
              setAnswer={engine.setAnswer}
              isFirst={engine.isFirst}
              isLast={engine.isLast}
              currentStep={engine.currentIndex + 1}
              totalSteps={engine.totalSteps}
              onBack={engine.goBack}
              onNext={engine.goNext}
              validationError={engine.validationError}
            />
          ) : (
            <View />
          )}
        </View>
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
  bufferingWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
});
