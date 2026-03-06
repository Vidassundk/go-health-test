import IconButton from "@/components/IconButton";
import { ArrowIcon } from "@/components/Icons/ArrowIcon";
import QuizProgressBar from "@/components/QuizProgressBar";
import { COLORS } from "@/constants/colors";
import React from "react";
import { StyleSheet, View } from "react-native";

export const HEADER_HEIGHT = 42;

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
  return (
    <View style={styles.container}>
      <IconButton
        icon={<ArrowIcon size={22} color={COLORS.text} />}
        onPress={isBackDisabled ? () => {} : onBackPress}
        accessibilityRole="button"
        accessibilityLabel="Go back"
      />
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
  progressWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  spacer: {
    width: 22,
  },
});
