import { AppOptionSelectChrome } from "@/components/AppOptionSelectChrome";
import { COLORS } from "@/constants/colors";
import { TYPOGRAPHY } from "@/constants/typography";
import {
  WHEEL_CENTER_OFFSET,
  WHEEL_CHROME_HEIGHT,
} from "@/constants/wheelPicker";
import type React from "react";
import { StyleSheet, View } from "react-native";

type Props = {
  labelOverlay?: React.ReactNode;
};

export function WheelPickerChrome({ labelOverlay }: Props) {
  return (
    <View
      style={[
        styles.backgroundSlot,
        {
          top: "50%",
          marginTop: -WHEEL_CHROME_HEIGHT / 2 + WHEEL_CENTER_OFFSET,
          height: WHEEL_CHROME_HEIGHT,
        },
      ]}
    >
      <AppOptionSelectChrome height={WHEEL_CHROME_HEIGHT} />
      {labelOverlay}
    </View>
  );
}

export const wheelPickerStyles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  placeholder: {
    minHeight: 240,
    justifyContent: "center",
    marginTop: 50,
  },
  pickerRowWrapper: {
    position: "relative",
    alignItems: "center",
  },
  pickerWrapper: {
    width: 110,
    justifyContent: "flex-start",
  },
  overlayItem: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.optionBorderInactive,
  },
});

export const wheelPickerItemTextStyle = [
  TYPOGRAPHY.headingSemiRight,
  { color: COLORS.text, textAlign: "center" as const },
];

const styles = StyleSheet.create({
  backgroundSlot: {
    position: "absolute",
    left: 0,
    right: 0,
    alignSelf: "stretch",
  },
});
