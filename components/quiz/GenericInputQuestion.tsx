import type { QuizQuestion } from "@/types/quiz";
import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  question: QuizQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
};

export function GenericInputQuestion({ value, onChange }: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={value ?? ""}
        onChangeText={onChange}
        placeholder="Your answer"
        placeholderTextColor={COLORS.textAlt}
        keyboardType="default"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  input: {
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.textAlt,
    borderRadius: 8,
    color: COLORS.text,
    fontSize: 16,
  },
});
