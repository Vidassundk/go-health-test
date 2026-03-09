import { COLORS } from "@/constants/colors";
import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import type { BottomActionConfig } from "../ScreenWithBottomAction";
import ScreenWithBottomAction from "../ScreenWithBottomAction";

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
            <View style={styles.contentArea}>{children}</View>
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
