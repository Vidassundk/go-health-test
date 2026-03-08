import {
  selectWheelPickerReady,
  useWheelPickerStore,
} from "@/stores/wheelPickerStore";
import { useEffect, useLayoutEffect, useState } from "react";
import { InteractionManager } from "react-native";

type Params = {
  isTransitioning?: boolean;
};

/**
 * Gates heavy wheel-picker rendering behind app readiness + interaction idle state.
 * Returns whether a loading buffer should be shown instead of the picker.
 */
export function useWheelPickerRenderGate({
  isTransitioning = false,
}: Params): boolean {
  const isReady = useWheelPickerStore(selectWheelPickerReady);
  const setShowingBuffer = useWheelPickerStore((s) => s.setShowingBuffer);
  const [canRenderPicker, setCanRenderPicker] = useState(false);

  useEffect(() => {
    setCanRenderPicker(false);
    if (!isReady || isTransitioning) {
      return;
    }
    const handle = InteractionManager.runAfterInteractions(() => {
      requestAnimationFrame(() => setCanRenderPicker(true));
    });
    return () => handle.cancel();
  }, [isReady, isTransitioning]);

  const isShowingBuffer = !isReady || isTransitioning || !canRenderPicker;

  useLayoutEffect(() => {
    setShowingBuffer(isShowingBuffer);
    return () => setShowingBuffer(false);
  }, [isShowingBuffer, setShowingBuffer]);

  return isShowingBuffer;
}
