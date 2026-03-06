import AppText from "@/components/AppText";
import { COLORS } from "@/constants/colors";
import type { QuizQuestion } from "@/types/quiz";
import React, { useState } from "react";
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
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const emailError = emailTouched && !email.trim() ? "Email is required" : null;
  const passwordError =
    passwordTouched && (!password || password.length < 6)
      ? "Password must be at least 6 characters"
      : null;

  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, emailError && styles.inputError]}
        value={email}
        onChangeText={(email) =>
          onChange({ ...value, email, password })
        }
        onBlur={() => setEmailTouched(true)}
        placeholder="Email"
        placeholderTextColor={COLORS.textAlt}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError && (
        <AppText variant="body" color={COLORS.error} style={styles.error}>
          {emailError}
        </AppText>
      )}
      <TextInput
        style={[styles.input, passwordError && styles.inputError]}
        value={password}
        onChangeText={(password) =>
          onChange({ ...value, email, password })
        }
        onBlur={() => setPasswordTouched(true)}
        placeholder="Password (min 6 characters)"
        placeholderTextColor={COLORS.textAlt}
        secureTextEntry
      />
      {passwordError && (
        <AppText variant="body" color={COLORS.error} style={styles.error}>
          {passwordError}
        </AppText>
      )}
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
  inputError: {
    borderColor: COLORS.error,
  },
  error: {
    marginTop: 4,
  },
});
