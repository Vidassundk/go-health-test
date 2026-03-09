import { useEffect } from "react";
import { InteractionManager } from "react-native";
import { useWheelPickerStore } from "@/stores";

export function WheelPickerReadyInit() {
  useEffect(() => {
    const handle = InteractionManager.runAfterInteractions(() => {
      useWheelPickerStore.getState().setReady(true);
    });
    return () => handle.cancel();
  }, []);
  return null;
}
