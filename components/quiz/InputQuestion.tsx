import { AppTextInput } from "../AppTextInput";
import AppText from "../AppText";
import type { QuizQuestion } from "@/types/quiz";
import { COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { useFocusOnTransitionEnd } from "@/hooks";
import React, { useRef } from "react";
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
  isTransitioning?: boolean;
  onConfirm?: () => void;
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
        placeholder: locale.common.placeholders.genericAnswer,
        suffix: undefined,
      };
  }
}

export function InputQuestion({
  question,
  value,
  onChange,
  isTransitioning = false,
  onConfirm,
}: Props) {
  const config = getInputConfig(question);
  const stringValue =
    value !== undefined && value !== null ? String(value) : "";
  const inputRef = useRef<TextInput>(null);
  useFocusOnTransitionEnd(inputRef, isTransitioning);

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <AppTextInput
          ref={inputRef}
          containerStyle={styles.input}
          value={stringValue}
          onChangeText={(text) => onChange(text)}
          keyboardType={config.keyboardType}
          placeholder={config.placeholder}
          textContentType="name"
          autoComplete="name"
          returnKeyType="go"
          onSubmitEditing={onConfirm}
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
  },
  suffix: {
    fontSize: 16,
  },
});
