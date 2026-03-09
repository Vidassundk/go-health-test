import { locale } from "@/constants/locale";
import { useFocusOnTransitionEnd } from "@/hooks";
import { getEmailValidationError, getPasswordValidationError } from "@/utils/validation";
import React, { useRef, useState } from "react";
import { ScrollView, StyleSheet, TextInput, type LayoutChangeEvent } from "react-native";
import { AnimatedError } from "../AnimatedError";
import { AppTextInput } from "../AppTextInput";

type CredentialsValue = { email: string; password: string };
// Keep a stable extra tail so content remains scrollable while error rows animate in/out.
const CONTENT_BOTTOM_PADDING = 32;
const CONTENT_SCROLL_SLACK = 24;

type Props = {
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
  const [containerHeight, setContainerHeight] = useState(0);
  const [touched, setTouched] = useState({
    email: false,
    password: false,
  });
  useFocusOnTransitionEnd(emailRef, isTransitioning);

  const emailError = getEmailValidationError(email);
  const passwordError = getPasswordValidationError(password);
  const showEmailError = submitAttempted || touched.email;
  const showPasswordError = submitAttempted || touched.password;
  // Capture viewport height to derive a dynamic minHeight for ScrollView content.
  const handleContainerLayout = ({ nativeEvent }: LayoutChangeEvent) => {
    const nextHeight = nativeEvent.layout.height;
    setContainerHeight((prev) => (prev === nextHeight ? prev : nextHeight));
  };

  return (
    <ScrollView
      style={styles.container}
      onLayout={handleContainerLayout}
      contentContainerStyle={[
        styles.content,
        containerHeight > 0
          // Keep content slightly taller than viewport so disappearing errors
          // do not collapse scrollability and drop bottom spacing.
          ? { minHeight: containerHeight + CONTENT_BOTTOM_PADDING + CONTENT_SCROLL_SLACK }
          : null,
      ]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
      showsVerticalScrollIndicator={false}
    >
      <AppTextInput
        ref={emailRef}
        error={showEmailError && Boolean(emailError)}
        value={email}
        onChangeText={(nextEmail) => onChange({ ...value, email: nextEmail, password })}
        placeholder={locale.common.placeholders.email}
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
        onChangeText={(nextPassword) => onChange({ ...value, email, password: nextPassword })}
        placeholder={locale.common.placeholders.password}
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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },
  content: {
    gap: 12,
    paddingBottom: CONTENT_BOTTOM_PADDING,
  },
});
