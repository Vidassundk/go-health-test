import AppButton from "./AppButton";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";

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
      <View style={[styles.content, { paddingHorizontal: horizontalPadding }, contentStyle]}>
        {children}
      </View>
      {actionKeyboardAvoiding ? (
        <KeyboardAvoidingView
          style={styles.footerAvoider}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={actionKeyboardVerticalOffset}
        >
          {footer}
        </KeyboardAvoidingView>
      ) : (
        footer
      )}
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
