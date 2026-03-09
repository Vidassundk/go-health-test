import type { BottomActionConfig } from "../ScreenWithBottomAction";
import { HEADER_HEIGHT } from "../Header";
import ScreenWithBottomAction from "../ScreenWithBottomAction";
import { COLORS } from "@/constants/colors";
import type { ReactNode } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";

type Props = {
  isVisible: boolean;
  entering: React.ComponentProps<typeof Animated.View>["entering"];
  exiting: React.ComponentProps<typeof Animated.View>["exiting"];
  action: BottomActionConfig | null;
  isTransitioning: boolean;
  children: ReactNode;
  beforeContent?: ReactNode;
};

/**
 * Shared screen scaffold for quiz-flow routes.
 * Keeps bottom CTA, keyboard behavior, and header offset consistent.
 */
export function QuizFlowScreenShell({
  isVisible,
  entering,
  exiting,
  action,
  isTransitioning,
  children,
  beforeContent,
}: Props) {
  return (
    <View style={styles.screen}>
      {isVisible ? (
        <Animated.View style={styles.animatedContent} entering={entering} exiting={exiting}>
          <ScreenWithBottomAction
            action={action}
            edges={["bottom"]}
            contentStyle={styles.contentNoHorizontalPadding}
            actionPointerEventsDisabled={isTransitioning}
            actionKeyboardAvoiding
            footerStyle={styles.fixedFooter}
          >
            {beforeContent}
            <KeyboardAvoidingView
              style={styles.contentArea}
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? HEADER_HEIGHT / 2 : 0}
            >
              {children}
            </KeyboardAvoidingView>
          </ScreenWithBottomAction>
        </Animated.View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  animatedContent: {
    flex: 1,
  },
  contentArea: {
    flex: 1,
    marginTop: -HEADER_HEIGHT,
    paddingTop: HEADER_HEIGHT,
    alignItems: "stretch",
  },
  contentNoHorizontalPadding: {
    paddingHorizontal: 0,
  },
  fixedFooter: {
    backgroundColor: COLORS.background,
    paddingTop: 8,
  },
});
