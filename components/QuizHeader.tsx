import IconButton from "@/components/IconButton";
import { ArrowIcon } from "@/components/Icons/ArrowIcon";
import QuizProgressBar from "@/components/QuizProgressBar";
import { SpinningBuffer } from "@/components/SpinningBuffer";
import { COLORS } from "@/constants/colors";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StyleSheet, View } from "react-native";

export const HEADER_HEIGHT = 42;
const BACK_COOLDOWN_MS = 600;
const BACK_SPINNER_SIZE = 22;

type QuizHeaderProps = {
  onBackPress: () => void;
  progress: number;
  isBackDisabled?: boolean;
};

export default function QuizHeader({
  onBackPress,
  progress,
  isBackDisabled = false,
}: QuizHeaderProps) {
  const [isCooldown, setIsCooldown] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleBackPress = useCallback(() => {
    if (isBackDisabled || isCooldown) return;
    onBackPress();
    setIsCooldown(true);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setIsCooldown(false);
    }, BACK_COOLDOWN_MS);
  }, [onBackPress, isBackDisabled, isCooldown]);

  const showSpinner = isCooldown;

  return (
    <View style={styles.container}>
      <View style={styles.backButton}>
        {showSpinner ? (
          <SpinningBuffer size={BACK_SPINNER_SIZE} color={COLORS.text} />
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
      <View style={styles.spacer} />
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
  spacer: {
    width: 22,
  },
});
