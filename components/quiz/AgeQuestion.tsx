import { SpinningBuffer } from "@/components/SpinningBuffer";
import { COLORS } from "@/constants/colors";
import { WHEEL_ITEM_HEIGHT } from "@/constants/wheelPicker";
import { useWheelPickerRenderGate } from "@/hooks/useWheelPickerRenderGate";
import { isValueUnset, resolveAgeValue } from "@/utils/wheelValues";
import WheelPicker from "@quidone/react-native-wheel-picker";
import React, { useCallback, useEffect, useMemo } from "react";
import { View } from "react-native";
import {
  WheelPickerChrome,
  wheelPickerItemTextStyle,
  wheelPickerStyles,
} from "./WheelPickerChrome";

const AGE_MIN = 1;
const AGE_MAX = 120;
const AGE_DEFAULT = 30;

const ageData = Array.from({ length: AGE_MAX - AGE_MIN + 1 }, (_, i) => ({
  value: AGE_MIN + i,
  label: String(AGE_MIN + i),
}));

type Props = {
  value: string | number | undefined;
  onChange: (value: number) => void;
  isTransitioning?: boolean;
};

export function AgeQuestion({
  value,
  onChange,
  isTransitioning = false,
}: Props) {
  const isShowingBuffer = useWheelPickerRenderGate({ isTransitioning });

  const age = useMemo(() => {
    return resolveAgeValue(value, AGE_MIN, AGE_MAX, AGE_DEFAULT);
  }, [value]);

  useEffect(() => {
    if (isValueUnset(value)) {
      onChange(AGE_DEFAULT);
    }
  }, [value, onChange]);

  const handleChange = useCallback(
    (v: number) => {
      onChange(v);
    },
    [onChange]
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

  return (
    <View style={wheelPickerStyles.container}>
      <WheelPickerChrome />
      <View style={wheelPickerStyles.pickerRowWrapper}>
        <View
          style={[
            wheelPickerStyles.pickerWrapper,
            { height: WHEEL_ITEM_HEIGHT * 5 },
          ]}
        >
          <WheelPicker
            data={ageData}
            value={age}
            onValueChanged={({ item: { value: v } }) => handleChange(v)}
            itemHeight={WHEEL_ITEM_HEIGHT}
            visibleItemCount={5}
            enableScrollByTapOnItem
            itemTextStyle={wheelPickerItemTextStyle}
            overlayItemStyle={wheelPickerStyles.overlayItem}
          />
        </View>
      </View>
    </View>
  );
}
