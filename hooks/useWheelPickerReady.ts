import { useEffect, useState } from "react";
import { InteractionManager } from "react-native";

export function useWheelPickerReady(): boolean {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const handle = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });
    return () => handle.cancel();
  }, []);

  return isReady;
}
