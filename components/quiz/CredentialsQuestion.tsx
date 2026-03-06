import AppText from "@/components/AppText";
import { COLORS } from "@/constants/colors";
import type { QuizQuestion } from "@/types/quiz";
import React, { useEffect, useRef } from "react";
import { StyleSheet, TextInput, View } from "react-native";

type CredentialsValue = { email: string; password: string };

type Props = {
  question: QuizQuestion;
  value: CredentialsValue | undefined;
  onChange: (value: CredentialsValue) => void;
  isTransitioning?: boolean;
  onConfirm?: () => void;
  submitAttempted?: boolean;
  onSubmitAttempt?: () => void;
};

export function CredentialsQuestion({
  value,
  onChange,
  isTransitioning = false,
  onConfirm,
  submitAttempted = false,
  onSubmitAttempt,
}: Props) {
  const email = value?.email ?? "";
  const password = value?.password ?? "";
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const prevTransitioningRef = useRef(true);

  useEffect(() => {
    if (prevTransitioningRef.current && !isTransitioning) {
      prevTransitioningRef.current = false;
      emailRef.current?.focus();
    } else if (isTransitioning) {
      prevTransitioningRef.current = true;
    }
  }, [isTransitioning]);

  const emailError =
    submitAttempted && !email.trim() ? "Email is required" : null;
  const passwordError =
    submitAttempted && (!password || password.length < 6)
      ? "Password must be at least 6 characters"
      : null;

  return (
    <View style={styles.container}>
      <TextInput
        ref={emailRef}
        style={[styles.input, emailError && styles.inputError]}
        value={email}
        onChangeText={(email) =>
          onChange({ ...value, email, password })
        }
        placeholder="Email"
        placeholderTextColor={COLORS.textAlt}
        keyboardType="email-address"
        autoCapitalize="none"
        textContentType="emailAddress"
        autoComplete="email"
        returnKeyType="next"
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      {emailError && (
        <AppText variant="body" color={COLORS.error} style={styles.error}>
          {emailError}
        </AppText>
      )}
      <TextInput
        ref={passwordRef}
        style={[styles.input, passwordError && styles.inputError]}
        value={password}
        onChangeText={(password) =>
          onChange({ ...value, email, password })
        }
        placeholder="Password (min 6 characters)"
        placeholderTextColor={COLORS.textAlt}
        secureTextEntry
        textContentType="password"
        autoComplete="password"
        returnKeyType="go"
        onSubmitEditing={() => {
          onSubmitAttempt?.();
          onConfirm?.();
        }}
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
