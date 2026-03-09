import AppText from "../AppText";
import { COLORS } from "@/constants/colors";
import { selectAnswer, useQuizStore } from "@/stores";
import type { QuizQuestion } from "@/types/quiz";
import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import { QuestionRenderer } from "./QuestionRenderer";

type Props = {
  question: QuizQuestion;
  isLast: boolean;
  onNext: () => void;
  setAnswer: (key: string, value: unknown) => void;
  isTransitioning?: boolean;
  submitAttempted?: boolean;
  onSubmitAttempt?: () => void;
};

function QuizFlowInner({
  question,
  onNext,
  setAnswer,
  isTransitioning = false,
  submitAttempted = false,
  onSubmitAttempt,
}: Props) {
  const value = useQuizStore(selectAnswer(question.key));

  const handleChange = (v: unknown) => setAnswer(question.key, v);

  return (
    <View
      style={styles.container}
      pointerEvents={isTransitioning ? "none" : undefined}
    >
      <View style={styles.header}>
        <AppText variant="caption" color={COLORS.textAlt}>
          {question.subtitle}
        </AppText>
        <AppText variant="heading" color={COLORS.text}>
          {question.title}
        </AppText>
      </View>

      <View style={styles.body}>
        <QuestionRenderer
          question={question}
          value={value}
          onChange={handleChange}
          isTransitioning={isTransitioning}
          onConfirm={onNext}
          submitAttempted={submitAttempted}
          onSubmitAttempt={onSubmitAttempt}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
    gap: 24,
  },
  header: {
    gap: 10,
  },
  body: {
    flex: 1,
    gap: 12,
    justifyContent: "flex-start",
  },
});

export const QuizFlow = memo(QuizFlowInner);
