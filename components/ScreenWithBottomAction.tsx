import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  Keyboard,
  KeyboardEvent,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
  useWindowDimensions,
} from "react-native";
import { Edge, SafeAreaView } from "react-native-safe-area-context";
import AppButton from "./AppButton";

const EXTRA_KEYBOARD_GAP = 30;

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
}: Props) {
  const { height: windowHeight } = useWindowDimensions();
  const keyboardLift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!actionKeyboardAvoiding) {
      keyboardLift.setValue(0);
      return;
    }

    const getTargetLift = (event: KeyboardEvent) => {
      const keyboardHeight = Math.max(0, windowHeight - event.endCoordinates.screenY);
      return Math.max(0, keyboardHeight - EXTRA_KEYBOARD_GAP);
    };

    const animateTo = (toValue: number, duration?: number) => {
      Animated.timing(keyboardLift, {
        toValue,
        duration: duration ?? 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    };

    const onShow = (event: KeyboardEvent) => {
      animateTo(getTargetLift(event), event.duration);
    };

    const onHide = (event?: KeyboardEvent) => {
      animateTo(0, event?.duration);
    };

    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showSub.remove();
      hideSub.remove();
      keyboardLift.setValue(0);
    };
  }, [actionKeyboardAvoiding, keyboardLift, windowHeight]);

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
      <View style={styles.body}>
        <View style={[styles.content, { paddingHorizontal: horizontalPadding }, contentStyle]}>
          {children}
        </View>
        <Animated.View
          style={[
            styles.footerAvoider,
            actionKeyboardAvoiding
              ? { transform: [{ translateY: Animated.multiply(keyboardLift, -1) }] }
              : null,
          ]}
        >
          {footer}
        </Animated.View>
      </View>
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
    minHeight: 0,
  },
  content: {
    flex: 1,
    minHeight: 0,
  },
  footer: {
    alignItems: "stretch",
  },
  footerAvoider: {
    alignItems: "stretch",
    flexShrink: 0,
  },
});
