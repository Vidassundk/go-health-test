import AppText from "../AppText";
import { SpinningBuffer } from "../SpinningBuffer";
import { COLORS } from "@/constants/colors";
import { WHEEL_ITEM_HEIGHT } from "@/constants/wheelPicker";
import { useWheelPickerRenderGate } from "@/hooks";
import { isValueUnset, resolveWeightValue } from "@/utils/wheelValues";
import WheelPicker from "@quidone/react-native-wheel-picker";
import React, { useCallback, useEffect, useMemo } from "react";
import { StyleSheet, View } from "react-native";
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
  value: string | number | undefined;
  onChange: (value: number) => void;
  isTransitioning?: boolean;
};

export function WeightQuestion({
  value,
  onChange,
  isTransitioning = false,
}: Props) {
  const isShowingBuffer = useWheelPickerRenderGate({ isTransitioning });

  const { whole, decimal } = useMemo(() => {
    return resolveWeightValue(
      value,
      WHOLE_MIN,
      WHOLE_MAX,
      DECIMAL_MIN,
      DECIMAL_MAX
    );
  }, [value]);

  useEffect(() => {
    if (isValueUnset(value)) {
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

  if (isShowingBuffer) {
    return (
      <View
        style={[wheelPickerStyles.container, wheelPickerStyles.placeholder]}
      >
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
