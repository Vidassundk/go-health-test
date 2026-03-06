import AppText from "@/components/AppText";
import { COLORS } from "@/constants/colors";
import type { QuestionOption, QuizQuestion } from "@/types/quiz";
import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

type Props = {
  question: QuizQuestion;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
};

export function OptionsQuestion({ question, value, onChange }: Props) {
  const isMultiple = question.type === "multiple";
  const options = question.options ?? [];

  const isSelected = (opt: QuestionOption) => {
    if (Array.isArray(value)) return value.includes(opt.value);
    return value === opt.value;
  };

  const handlePress = (opt: QuestionOption) => {
    if (isMultiple) {
      const current = (value as string[]) ?? [];
      const next = current.includes(opt.value)
        ? current.filter((v) => v !== opt.value)
        : [...current, opt.value];
      onChange(next);
    } else {
      onChange(opt.value);
    }
  };

  return (
    <View style={styles.container}>
      {options.map((opt) => (
        <Pressable
          key={opt.value}
          onPress={() => handlePress(opt)}
          style={[styles.option, isSelected(opt) && styles.optionSelected]}
        >
          <AppText
            variant="body"
            color={isSelected(opt) ? COLORS.text : COLORS.textAlt}
          >
            {opt.title}
          </AppText>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  option: {
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.textAlt,
    borderRadius: 8,
  },
  optionSelected: {
    borderColor: COLORS.text,
    backgroundColor: "rgba(108, 66, 255, 0.2)",
  },
});
