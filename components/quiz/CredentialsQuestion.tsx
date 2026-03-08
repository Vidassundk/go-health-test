import { AnimatedError } from "@/components/AnimatedError";
import { AppTextInput } from "@/components/AppTextInput";
import type { QuizQuestion } from "@/types/quiz";
import {
  getEmailValidationError,
  getPasswordValidationError,
} from "@/utils/validation";
import React, { useEffect, useRef, useState } from "react";
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
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });

  useEffect(() => {
    if (prevTransitioningRef.current && !isTransitioning) {
      prevTransitioningRef.current = false;
      emailRef.current?.focus();
    } else if (isTransitioning) {
      prevTransitioningRef.current = true;
    }
  }, [isTransitioning]);

  const emailError = getEmailValidationError(email);
  const passwordError = getPasswordValidationError(password);
  const showEmailError = submitAttempted || touched.email;
  const showPasswordError = submitAttempted || touched.password;

  return (
    <View style={styles.container}>
      <AppTextInput
        ref={emailRef}
        error={showEmailError && Boolean(emailError)}
        value={email}
        onChangeText={(nextEmail) =>
          onChange({ ...value, email: nextEmail, password })
        }
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="emailAddress"
        autoComplete="email"
        returnKeyType="next"
        onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
        onSubmitEditing={() => passwordRef.current?.focus()}
      />
      <AnimatedError error={showEmailError ? emailError : null} />
      <AppTextInput
        ref={passwordRef}
        error={showPasswordError && Boolean(passwordError)}
        value={password}
        onChangeText={(nextPassword) =>
          onChange({ ...value, email, password: nextPassword })
        }
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        textContentType="password"
        autoComplete="password"
        returnKeyType="go"
        onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
        onSubmitEditing={() => {
          onSubmitAttempt?.();
          onConfirm?.();
        }}
      />
      <AnimatedError error={showPasswordError ? passwordError : null} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 12,
  },
});
