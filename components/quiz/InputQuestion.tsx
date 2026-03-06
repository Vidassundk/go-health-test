import AppText from "@/components/AppText";
import type { QuizQuestion } from "@/types/quiz";
import { COLORS } from "@/constants/colors";
import React from "react";
import {
  KeyboardTypeOptions,
  StyleSheet,
  TextInput,
  View,
} from "react-native";

type Props = {
  question: QuizQuestion;
  value: string | number | undefined;
  onChange: (value: string | number) => void;
};

function getInputConfig(question: QuizQuestion): {
  keyboardType: KeyboardTypeOptions;
  placeholder: string;
  suffix?: string;
} {
  switch (question.type) {
    case "name":
    default:
      return {
        keyboardType: "default",
        placeholder: "Your answer",
        suffix: undefined,
      };
  }
}

export function InputQuestion({ question, value, onChange }: Props) {
  const config = getInputConfig(question);
  const stringValue =
    value !== undefined && value !== null ? String(value) : "";

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={stringValue}
          onChangeText={(text) => onChange(text)}
          keyboardType={config.keyboardType}
          placeholder={config.placeholder}
          placeholderTextColor={COLORS.textAlt}
        />
        {config.suffix && (
          <AppText style={styles.suffix} color={COLORS.textAlt}>
            {config.suffix}
          </AppText>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  input: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.textAlt,
    borderRadius: 8,
    color: COLORS.text,
    fontSize: 16,
  },
  suffix: {
    fontSize: 16,
  },
});
