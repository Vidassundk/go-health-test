import IconButton from "./IconButton";
import { ArrowIcon, TrashIcon } from "@icons";
import QuizProgressBar from "./QuizProgressBar";
import { isDebugWipeDataButtonEnabled } from "@/config/featureFlags";
import { COLORS } from "@/constants/colors";
import { useQuizStore } from "@/stores";
import { triggerImpactHaptic } from "@/utils/haptics";
import React, { useCallback } from "react";
import { StyleSheet, View } from "react-native";

export const HEADER_HEIGHT = 42;

type HeaderProps = {
  onBackPress: () => void;
  progress: number;
  isBackDisabled?: boolean;
  hideBackButton?: boolean;
};

export default function Header({
  onBackPress,
  progress,
  isBackDisabled = false,
  hideBackButton = false,
}: HeaderProps) {
  const handleBackPress = useCallback(() => {
    if (isBackDisabled) return;
    triggerImpactHaptic();
    onBackPress();
  }, [onBackPress, isBackDisabled]);

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        {hideBackButton ? (
          <View style={styles.backButton} />
        ) : (
          <IconButton
            icon={<ArrowIcon size={22} color={COLORS.text} />}
            onPress={handleBackPress}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          />
        )}
      </View>
      <View style={styles.progressWrapper}>
        <QuizProgressBar progress={progress} />
      </View>
      {isDebugWipeDataButtonEnabled() ? (
        <View style={styles.wipeButton}>
          <IconButton
            icon={<TrashIcon size={22} color={COLORS.text} />}
            onPress={() => useQuizStore.getState().reset()}
            accessibilityRole="button"
            accessibilityLabel="Wipe quiz state (debug)"
          />
        </View>
      ) : (
        // Spacer
        <View style={styles.wipeButton} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: HEADER_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  backButton: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  progressWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  wipeButton: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
