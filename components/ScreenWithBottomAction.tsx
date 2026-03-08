import AppButton from "@/components/AppButton";
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
  edges?: Edge[];
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
  edges = ["top", "bottom"],
  safeAreaStyle,
  contentStyle,
  footerStyle,
  actionPointerEventsDisabled = false,
  actionKeyboardAvoiding = false,
  actionKeyboardVerticalOffset = 0,
}: Props) {
  const footer =
    action === null ? null : (
      <View
        style={footerStyle}
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
      <View style={[styles.content, contentStyle]}>{children}</View>
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
  content: {
    flex: 1,
  },
  footerAvoider: {
    alignItems: "stretch",
  },
});
