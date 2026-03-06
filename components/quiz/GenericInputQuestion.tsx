import { AppTextInput } from "@/components/AppTextInput";
import type { QuizQuestion } from "@/types/quiz";
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
      <AppTextInput
        ref={inputRef}
        value={value ?? ""}
        onChangeText={onChange}
        placeholder="Your answer"
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
});
