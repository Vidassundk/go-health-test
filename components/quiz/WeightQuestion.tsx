import AppText from "@/components/AppText";
import { SpinningBuffer } from "@/components/SpinningBuffer";
import { COLORS } from "@/constants/colors";
import { WHEEL_ITEM_HEIGHT } from "@/constants/wheelPicker";
import type { QuizQuestion } from "@/types/quiz";
import WheelPicker from "@quidone/react-native-wheel-picker";
import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { useWheelPickerReady } from "@/hooks/useWheelPickerReady";
import {
  WheelPickerChrome,
  wheelPickerItemTextStyle,
  wheelPickerStyles,
} from "./WheelPickerChrome";

const WHOLE_MIN = 50;
const WHOLE_MAX = 600;
const DECIMAL_MIN = 0;
const DECIMAL_MAX = 9;

const wholeLbData = Array.from(
  { length: WHOLE_MAX - WHOLE_MIN + 1 },
  (_, i) => ({ value: WHOLE_MIN + i, label: String(WHOLE_MIN + i) })
);

const decimalData = Array.from(
  { length: DECIMAL_MAX - DECIMAL_MIN + 1 },
  (_, i) => ({ value: i, label: String(i) })
);

type Props = {
  question: QuizQuestion;
  value: string | number | undefined;
  onChange: (value: number) => void;
  isTransitioning?: boolean;
};

export function WeightQuestion({
  value,
  onChange,
  isTransitioning = false,
}: Props) {
  const isReady = useWheelPickerReady();

  const { whole, decimal } = useMemo(() => {
    if (value === undefined || value === null) {
      return { whole: WHOLE_MIN, decimal: 0 };
    }
    const n = typeof value === "number" ? value : parseFloat(String(value));
    if (isNaN(n)) return { whole: WHOLE_MIN, decimal: 0 };
    const w = Math.floor(n);
    const d = Math.round((n - w) * 10);
    return {
      whole: Math.max(WHOLE_MIN, Math.min(WHOLE_MAX, w)),
      decimal: Math.max(0, Math.min(9, d)),
    };
  }, [value]);

  useEffect(() => {
    if (value === undefined || value === null) {
      onChange(WHOLE_MIN);
    }
  }, [value, onChange]);

  const handleWholeChange = useCallback(
    (v: number) => {
      onChange(v + decimal / 10);
    },
    [decimal, onChange]
  );

  const handleDecimalChange = useCallback(
    (v: number) => {
      onChange(whole + v / 10);
    },
    [whole, onChange]
  );

  if (!isReady || isTransitioning) {
    return (
      <View style={[wheelPickerStyles.container, wheelPickerStyles.placeholder]}>
        <SpinningBuffer size={40} color={COLORS.text} />
      </View>
    );
  }

  const labelOverlay = (
    <View style={styles.labelOverlay} pointerEvents="none">
      <View style={styles.pickerSpace} />
      <View style={styles.gapSlot}>
        <AppText variant="headingSemiRight" color={COLORS.text}>
          ,
        </AppText>
      </View>
      <View style={[styles.pickerSpace, styles.lbSlot]}>
        <AppText variant="headingSemiRight" color={COLORS.text}>
          Lb
        </AppText>
      </View>
    </View>
  );

  return (
    <View style={wheelPickerStyles.container}>
      <WheelPickerChrome labelOverlay={labelOverlay} />
      <View style={wheelPickerStyles.pickerRowWrapper}>
        <View style={styles.pickerRow}>
          <View
            style={[
              wheelPickerStyles.pickerWrapper,
              { height: WHEEL_ITEM_HEIGHT * 5 },
            ]}
          >
            <WheelPicker
              data={wholeLbData}
              value={whole}
              onValueChanged={({ item: { value: v } }) => handleWholeChange(v)}
              itemHeight={WHEEL_ITEM_HEIGHT}
              visibleItemCount={5}
              enableScrollByTapOnItem
              itemTextStyle={wheelPickerItemTextStyle}
              overlayItemStyle={wheelPickerStyles.overlayItem}
            />
          </View>
          <View
            style={[
              wheelPickerStyles.pickerWrapper,
              { height: WHEEL_ITEM_HEIGHT * 5 },
            ]}
          >
            <WheelPicker
              data={decimalData}
              value={decimal}
              onValueChanged={({ item: { value: v } }) =>
                handleDecimalChange(v)
              }
              itemHeight={WHEEL_ITEM_HEIGHT}
              visibleItemCount={5}
              enableScrollByTapOnItem
              itemTextStyle={wheelPickerItemTextStyle}
              overlayItemStyle={wheelPickerStyles.overlayItem}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  labelOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  pickerSpace: {
    width: 110,
  },
  gapSlot: {
    width: 4,
    justifyContent: "center",
    alignItems: "center",
    overflow: "visible",
  },
  lbSlot: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
