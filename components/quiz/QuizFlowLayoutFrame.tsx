import type { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import Animated from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";
import Header from "../Header";

type QuizFlowLayoutFrameProps = {
  isVisible: boolean;
  animatedHeaderStyle: React.ComponentProps<typeof Animated.View>["style"];
  onBackPress?: () => void;
  isBackDisabled: boolean;
  hideBackButton: boolean;
  progress: number;
  children: ReactNode;
};

export function QuizFlowLayoutFrame({
  isVisible,
  animatedHeaderStyle,
  onBackPress,
  isBackDisabled,
  hideBackButton,
  progress,
  children,
}: QuizFlowLayoutFrameProps) {
  return (
    <View style={styles.screen}>
      <SafeAreaView style={styles.staticHeader} edges={["top"]}>
        <Animated.View
          pointerEvents={isVisible ? "auto" : "none"}
          style={[styles.headerPadding, animatedHeaderStyle]}
        >
          <Header
            onBackPress={onBackPress}
            isBackDisabled={isBackDisabled}
            hideBackButton={hideBackButton}
            progress={progress}
          />
        </Animated.View>
      </SafeAreaView>
      <View style={styles.content}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  staticHeader: {
    flexShrink: 0,
  },
  headerPadding: {
    paddingHorizontal: 20,
  },
  content: {
    flex: 1,
  },
});
