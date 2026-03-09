import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  type LayoutChangeEvent,
} from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import AppButton from "./AppButton";

const EXTRA_KEYBOARD_GAP = -10;

export type BottomActionConfig = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  fillColor?: string;
};

type Props = {
  children: React.ReactNode;
  action: BottomActionConfig | null;
  header?: React.ReactNode | null;
  edges?: Edge[];
  horizontalPadding?: number;
  headerPaddingHorizontal?: number;
  safeAreaStyle?: StyleProp<ViewStyle>;
  contentStyle?: StyleProp<ViewStyle>;
  footerStyle?: StyleProp<ViewStyle>;
  actionPointerEventsDisabled?: boolean;
  actionKeyboardAvoiding?: boolean;
  actionKeyboardVerticalOffset?: number;
};

export default function ScreenWithBottomAction({
  children,
  action,
  header = null,
  edges = ["top", "bottom"],
  horizontalPadding = 20,
  headerPaddingHorizontal,
  safeAreaStyle,
  contentStyle,
  footerStyle,
  actionPointerEventsDisabled = false,
  actionKeyboardAvoiding = false,
  actionKeyboardVerticalOffset = 0,
}: Props) {
  const bodyAnchorRef = useRef<View>(null);
  const [measuredKeyboardOffset, setMeasuredKeyboardOffset] = useState(0);

  const updateMeasuredKeyboardOffset = useCallback(() => {
    if (!actionKeyboardAvoiding) return;

    bodyAnchorRef.current?.measureInWindow((_x, y) => {
      if (Number.isFinite(y)) {
        setMeasuredKeyboardOffset(Math.max(0, y));
      }
    });
  }, [actionKeyboardAvoiding]);

  useEffect(() => {
    if (!actionKeyboardAvoiding) return;

    const raf = requestAnimationFrame(updateMeasuredKeyboardOffset);
    return () => cancelAnimationFrame(raf);
  }, [actionKeyboardAvoiding, updateMeasuredKeyboardOffset]);

  const handleBodyAnchorLayout = useCallback(
    (_event: LayoutChangeEvent) => {
      updateMeasuredKeyboardOffset();
    },
    [updateMeasuredKeyboardOffset]
  );

  const effectiveKeyboardVerticalOffset =
    measuredKeyboardOffset + actionKeyboardVerticalOffset - EXTRA_KEYBOARD_GAP;

  const headerPadding = headerPaddingHorizontal ?? horizontalPadding;
  const footer =
    action === null ? null : (
      <View
        style={[styles.footer, { paddingHorizontal: horizontalPadding }, footerStyle]}
        pointerEvents={actionPointerEventsDisabled ? "none" : "auto"}
      >
        <AppButton
          label={action.label}
          onPress={action.onPress}
          disabled={action.disabled}
          fillColor={action.fillColor}
        />
      </View>
    );

  return (
    <SafeAreaView style={[styles.container, safeAreaStyle]} edges={edges}>
      {header ? (
        <View style={[styles.headerWrapper, { paddingHorizontal: headerPadding }]}>{header}</View>
      ) : null}
      <View ref={bodyAnchorRef} onLayout={handleBodyAnchorLayout} />
      <KeyboardAvoidingView
        style={styles.body}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={effectiveKeyboardVerticalOffset}
        enabled={actionKeyboardAvoiding}
      >
        <View style={[styles.content, { paddingHorizontal: horizontalPadding }, contentStyle]}>
          {children}
        </View>
        <View style={styles.footerAvoider}>{footer}</View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerWrapper: {
    alignItems: "stretch",
  },
  body: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  footer: {
    alignItems: "stretch",
  },
  footerAvoider: {
    alignItems: "stretch",
  },
});
