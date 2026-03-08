import { AppTextInput } from "../AppTextInput";
import { locale } from "@/constants/locale";
import { useFocusOnTransitionEnd } from "@/hooks/useFocusOnTransitionEnd";
import React, { useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type Props = {
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
  useFocusOnTransitionEnd(inputRef, isTransitioning);

  return (
    <View style={styles.container}>
      <AppTextInput
        ref={inputRef}
        value={value ?? ""}
        onChangeText={onChange}
        placeholder={locale.common.placeholders.genericAnswer}
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
