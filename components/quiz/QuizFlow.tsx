import AppText from "@/components/AppText";
import { COLORS } from "@/constants/colors";
import type { QuizQuestion } from "@/types/quiz";
import { selectAnswer, useQuizStore } from "@/stores/quizStore";
import {
  selectWheelPickerShowingBuffer,
  useWheelPickerStore,
} from "@/stores/wheelPickerStore";
import React, { memo, useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import AppButton from "../AppButton";
import { QuestionRenderer } from "./QuestionRenderer";

type Props = {
  question: QuizQuestion;
  isLast: boolean;
  onNext: () => void;
  setAnswer: (key: string, value: unknown) => void;
  isTransitioning?: boolean;
  canProceed?: boolean;
};

function QuizFlowInner({
  question,
  isLast,
  onNext,
  setAnswer,
  isTransitioning = false,
  canProceed = true,
}: Props) {
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const value = useQuizStore(selectAnswer(question.key));
  const isWheelPickerShowingBuffer = useWheelPickerStore(
    selectWheelPickerShowingBuffer
  );
  const isWheelPickerQuestion =
    question.type === "age" || question.type === "weight";

  useEffect(() => {
    setSubmitAttempted(false);
  }, [question.key]);

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
          onSubmitAttempt={() => setSubmitAttempted(true)}
        />
      </View>
      <View style={styles.footer}>
        <AppButton
          key={question.key}
          label={isLast ? "Submit" : "Next"}
          onPress={() => {
            setSubmitAttempted(true);
            onNext();
          }}
          disabled={
            question.type === "credentials"
              ? false
              : !canProceed ||
                (isWheelPickerQuestion && isWheelPickerShowingBuffer)
          }
        />
      </View>
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
  footer: {
    backgroundColor: COLORS.background,
    paddingTop: 8,
  },
});

export const QuizFlow = memo(QuizFlowInner);
