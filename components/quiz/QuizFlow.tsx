import AppText from "@/components/AppText";
import { COLORS } from "@/constants/colors";
import type { QuizQuestion } from "@/types/quiz";
import React from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../AppButton";
import { QuestionRenderer } from "./QuestionRenderer";

type Props = {
  question: QuizQuestion;
  value: unknown;
  setAnswer: (key: string, value: unknown) => void;
  isFirst: boolean;
  isLast: boolean;
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isTransitioning?: boolean;
  canProceed?: boolean;
};

export function QuizFlow({
  question,
  value,
  setAnswer,
  isLast,
  onNext,
  isTransitioning = false,
  canProceed = true,
}: Props) {
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
          onChange={(v) => setAnswer(question.key, v)}
          isTransitioning={isTransitioning}
        />
      </View>
      <AppButton
        label={isLast ? "Submit" : "Next"}
        onPress={onNext}
        disabled={!canProceed}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
