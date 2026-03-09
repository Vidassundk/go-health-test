import { Header } from "@components";
import { CROSSFADE_DURATION_MS } from "@/constants/animations";
import { selectQuizHeaderState, useQuizHeaderStore } from "@/stores";
import { Slot } from "expo-router";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";
import { StyleSheet, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

export default function QuizFlowLayout() {
  const { progress, isBackDisabled, hideBackButton, isVisible, onBackPress } = useQuizHeaderStore(
    useShallow(selectQuizHeaderState)
  );
  const opacity = useSharedValue(isVisible ? 1 : 0);

  useEffect(() => {
    opacity.value = withTiming(isVisible ? 1 : 0, { duration: CROSSFADE_DURATION_MS });
  }, [isVisible, opacity]);

  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

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
      <View style={styles.content}>
        <Slot />
      </View>
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
