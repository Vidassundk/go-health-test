import AppButton from "@/components/AppButton";
import AppText from "@/components/AppText";
import { COLORS, PROGRESS_BAR_COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { useGlowContext } from "@/contexts/GlowContext";
import { useQuizStore } from "@/stores/quizStore";
import { useRouter } from "expo-router";
import type { QuizQuestion } from "@/types/quiz";
import {
  getSummaryDisplayData,
  type SummaryDisplayData,
} from "@/utils/getSummaryDisplayData";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import React, { useMemo } from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  questions: QuizQuestion[];
  onStartJourney?: () => void;
  isTransitioning?: boolean;
};

export function QuizSummary({
  questions,
  onStartJourney,
  isTransitioning = false,
}: Props) {
  const answers = useQuizStore((s) => s.answers);
  const router = useRouter();
  const { setGlowTarget } = useGlowContext();
  const summaryVariant = useMemo(() => getSummaryVariant(answers), [answers]);
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
      <AppButton
        label={labels.startJourney}
        disabled={isTransitioning}
        fillColor={PROGRESS_BAR_COLORS.summary[summaryVariant]}
        onPress={() => {
          if (onStartJourney) {
            onStartJourney();
          } else {
            setGlowTarget(0);
            router.push("/home");
          }
        }}
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
  sections: {
    flex: 1,
    gap: 40,
  },
  header: {
    gap: 10,
  },
  goalsBlock: {
    gap: 20,
  },
});
