import AppText from "@/components/AppText";
import { COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import type { QuizAnswers } from "@/hooks/useQuizEngine";
import type { SummaryVariant } from "@/utils/getSummaryVariant";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  answers: QuizAnswers;
};

export function QuizSummary({ answers }: Props) {
  const variant: SummaryVariant = getSummaryVariant(answers);
  const copy = locale.summary[variant];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <AppText variant="caption" color={COLORS.textAlt}>
          {copy.caption}
        </AppText>
        <AppText variant="heading" color={COLORS.text}>
          {copy.title}
        </AppText>
      </View>
      <View style={styles.body}>
        <AppText variant="body" color={COLORS.text}>
          {copy.body}
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
