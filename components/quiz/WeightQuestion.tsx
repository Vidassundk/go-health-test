import { AppOptionSelectChrome } from "@/components/AppOptionSelectChrome";
import AppText from "@/components/AppText";
import { SpinningBuffer } from "@/components/SpinningBuffer";
import { COLORS } from "@/constants/colors";
import { TYPOGRAPHY } from "@/constants/typography";
import type { QuizQuestion } from "@/types/quiz";
import WheelPicker from "@quidone/react-native-wheel-picker";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { InteractionManager, StyleSheet, View } from "react-native";

const WHOLE_MIN = 50;
const WHOLE_MAX = 600;
const DECIMAL_MIN = 0;
const DECIMAL_MAX = 9;
const ITEM_HEIGHT = 56;
const LABEL_VERTICAL_OFFSET = -28;
const CHROME_HEIGHT = 58;

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
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handle = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => handle.cancel();
  }, []);

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
      <View style={[styles.container, styles.placeholder]}>
        <SpinningBuffer size={40} color={COLORS.text} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.backgroundSlot,
          {
            top: "50%",
            marginTop: -CHROME_HEIGHT / 2 + LABEL_VERTICAL_OFFSET / 2,
            height: CHROME_HEIGHT,
          },
        ]}
      >
        <AppOptionSelectChrome height={CHROME_HEIGHT} />
      </View>
      <View style={styles.pickerRowWrapper}>
        <View style={styles.pickerRow}>
          <View style={[styles.pickerWrapper, { height: ITEM_HEIGHT * 5 }]}>
            <WheelPicker
              data={wholeLbData}
              value={whole}
              onValueChanged={({ item: { value: v } }) => handleWholeChange(v)}
              itemHeight={ITEM_HEIGHT}
              visibleItemCount={5}
              enableScrollByTapOnItem
              itemTextStyle={[
                TYPOGRAPHY.headingSemiRight,
                { color: COLORS.text, textAlign: "center" },
              ]}
              overlayItemStyle={styles.overlayItem}
            />
          </View>
          <View
            style={[
              styles.labelSlot,
              { height: ITEM_HEIGHT, marginTop: LABEL_VERTICAL_OFFSET },
            ]}
          >
            <AppText variant="headingSemiRight" color={COLORS.text}>
              ,
            </AppText>
          </View>
          <View style={[styles.pickerWrapper, { height: ITEM_HEIGHT * 5 }]}>
            <WheelPicker
              data={decimalData}
              value={decimal}
              onValueChanged={({ item: { value: v } }) =>
                handleDecimalChange(v)
              }
              itemHeight={ITEM_HEIGHT}
              visibleItemCount={5}
              enableScrollByTapOnItem
              itemTextStyle={[
                TYPOGRAPHY.headingSemiRight,
                { color: COLORS.text, textAlign: "center" },
              ]}
              overlayItemStyle={styles.overlayItem}
            />
          </View>
          <View
            style={[
              styles.labelSlot,
              { height: ITEM_HEIGHT, marginTop: LABEL_VERTICAL_OFFSET },
            ]}
          >
            <AppText variant="headingSemiRight" color={COLORS.text}>
              Lb
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    width: "100%",
    alignItems: "center",
    gap: 12,
  },
  placeholder: {
    minHeight: 240,
    justifyContent: "center",
  },
  pickerRowWrapper: {
    position: "relative",
    alignItems: "center",
  },
  backgroundSlot: {
    position: "absolute",
    left: 0,
    right: 0,
    alignSelf: "stretch",
  },

  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  pickerWrapper: {
    width: 110,
    justifyContent: "flex-start",
  },
  labelSlot: {
    justifyContent: "center",
    alignItems: "center",
  },
  overlayItem: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: COLORS.optionBorderInactive,
  },
});
