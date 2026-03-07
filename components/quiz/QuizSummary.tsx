import AppText from "@/components/AppText";
import { COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { useQuizStore } from "@/stores/quizStore";
import type { QuizQuestion } from "@/types/quiz";
import {
  getSummaryDisplayData,
  type SummaryDisplayData,
} from "@/utils/getSummaryDisplayData";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  questions: QuizQuestion[];
};

export function QuizSummary({ questions }: Props) {
  const answers = useQuizStore((s) => s.answers);
  const displayData: SummaryDisplayData = useMemo(
    () => getSummaryDisplayData(answers, questions),
    [answers, questions]
  );
  const { name, mainGoal, complementaryGoals } = displayData;
  const { labels } = locale.summary;

  return (
    <View style={styles.container}>
      <View style={styles.sections}>
        <View style={styles.header}>
          <AppText variant="body" color={COLORS.textAlt}>
            {labels.sectionTitle}
          </AppText>
          <AppText variant="heading" color={COLORS.text}>
            {labels.welcomePrefix}
            {name}
          </AppText>
        </View>
        <View style={styles.goalsBlock}>
          <View style={styles.header}>
            <AppText variant="body" color={COLORS.textAlt}>
              {labels.yourGoal}
            </AppText>
            <AppText variant="heading" color={COLORS.text}>
              {mainGoal}
            </AppText>
          </View>
          {complementaryGoals.length > 0 && (
            <View style={styles.header}>
              <AppText variant="body" color={COLORS.textAlt}>
                {complementaryGoals.length === 1
                  ? labels.complementaryGoal
                  : labels.complementaryGoals}
              </AppText>
              {complementaryGoals.map((goal, i) => (
                <AppText key={i} variant="bodyBold" color={COLORS.text}>
                  {goal}
                </AppText>
              ))}
            </View>
          )}
        </View>
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
  sections: {
    gap: 40,
  },
  header: {
    gap: 10,
  },
  goalsBlock: {
    gap: 20,
  },
});
