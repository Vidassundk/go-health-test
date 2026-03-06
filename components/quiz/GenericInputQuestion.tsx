import type { QuizQuestion } from "@/types/quiz";
import { COLORS } from "@/constants/colors";
import React, { useEffect, useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  question: QuizQuestion;
  value: string | undefined;
  onChange: (value: string) => void;
  isTransitioning?: boolean;
  onConfirm?: () => void;
};

export function GenericInputQuestion({
  value,
  onChange,
  isTransitioning = false,
  onConfirm,
}: Props) {
  const inputRef = useRef<TextInput>(null);
  const prevTransitioningRef = useRef(true);

  useEffect(() => {
    if (prevTransitioningRef.current && !isTransitioning) {
      prevTransitioningRef.current = false;
      inputRef.current?.focus();
    } else if (isTransitioning) {
      prevTransitioningRef.current = true;
    }
  }, [isTransitioning]);

  return (
    <View style={styles.container}>
      <TextInput
        ref={inputRef}
        style={styles.input}
        value={value ?? ""}
        onChangeText={onChange}
        placeholder="Your answer"
        placeholderTextColor={COLORS.textAlt}
        keyboardType="default"
        autoComplete="off"
        returnKeyType="go"
        onSubmitEditing={onConfirm}
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
