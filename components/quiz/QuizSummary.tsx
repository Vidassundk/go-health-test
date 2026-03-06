import AppText from "@/components/AppText";
import { COLORS } from "@/constants/colors";
import type { QuizAnswers } from "@/hooks/useQuizEngine";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  answers: QuizAnswers;
};

export function QuizSummary({ answers }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="caption" color={COLORS.textAlt}>
          All done
        </AppText>
        <AppText variant="heading" color={COLORS.text}>
          Summary
        </AppText>
      </View>
      <View style={styles.body}>
        <AppText variant="body" color={COLORS.text}>
          Thank you for completing the health quiz.
        </AppText>
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
  },
});
