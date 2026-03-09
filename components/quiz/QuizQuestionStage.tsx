import {
  TRANSITION_ENTER_MS,
  TRANSITION_EXIT_MS,
  TRANSITION_INITIAL_DELAY_MS,
} from "@/constants/animations";
import type { QuizQuestion } from "@/types/quiz";
import { StyleSheet, View } from "react-native";
import Animated, { FadeInRight, FadeOutLeft } from "react-native-reanimated";
import { FullScreenBuffer } from "../FullScreenBuffer";
import { QuizFlow } from "./QuizFlow";

type QuizQuestionStageProps = {
  isLoading: boolean;
  currentSectionKey?: string;
  question?: QuizQuestion;
  isLast: boolean;
  setAnswer: (key: string, value: unknown) => void;
  onNext: () => void;
  submitAttempted: boolean;
  onSubmitAttempt: () => void;
};

export function QuizQuestionStage({
  isLoading,
  currentSectionKey,
  question,
  isLast,
  setAnswer,
  onNext,
  submitAttempted,
  onSubmitAttempt,
}: QuizQuestionStageProps) {
  if (isLoading) {
    return <FullScreenBuffer />;
  }

  return (
    <View style={styles.quizLayout}>
      <View style={styles.quizContent}>
        <Animated.View
          key={currentSectionKey}
          entering={FadeInRight.duration(TRANSITION_ENTER_MS).delay(TRANSITION_INITIAL_DELAY_MS)}
          exiting={FadeOutLeft.duration(TRANSITION_EXIT_MS)}
          style={styles.sectionWrapper}
        >
          {question ? (
            <QuizFlow
              question={question}
              isLast={isLast}
              setAnswer={setAnswer}
              onNext={onNext}
              isTransitioning={false}
              submitAttempted={submitAttempted}
              onSubmitAttempt={onSubmitAttempt}
            />
          ) : (
            <View />
          )}
        </Animated.View>
      </View>
    </View>
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
});
