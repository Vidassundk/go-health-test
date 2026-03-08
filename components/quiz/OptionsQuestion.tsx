import { AppOptionSelect } from "../AppOptionSelect";
import type { QuestionOption, QuizQuestion } from "@/types/quiz";
import React from "react";
import { StyleSheet, View } from "react-native";

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
        <AppOptionSelect
          key={opt.value}
          opt={opt}
          selected={isSelected(opt)}
          onPress={() => handlePress(opt)}
          check={isMultiple}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});
