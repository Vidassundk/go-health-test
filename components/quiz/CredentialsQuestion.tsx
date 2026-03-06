import { COLORS } from "@/constants/colors";
import type { QuizQuestion } from "@/types/quiz";
import React from "react";
import { StyleSheet, TextInput, View } from "react-native";

type CredentialsValue = { email: string; password: string };

type Props = {
  question: QuizQuestion;
  value: CredentialsValue | undefined;
  onChange: (value: CredentialsValue) => void;
};

export function CredentialsQuestion({ value, onChange }: Props) {
  const email = value?.email ?? "";
  const password = value?.password ?? "";

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(email) => onChange({ ...value, email, password })}
        placeholder="Email"
        placeholderTextColor={COLORS.textAlt}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={[styles.input, styles.inputPassword]}
        value={password}
        onChangeText={(password) => onChange({ ...value, email, password })}
        placeholder="Password (min 6 characters)"
        placeholderTextColor={COLORS.textAlt}
        secureTextEntry
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 12,
  },
  input: {
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.textAlt,
    borderRadius: 8,
    color: COLORS.text,
    fontSize: 16,
  },
  inputPassword: {
    marginTop: 0,
  },
});
