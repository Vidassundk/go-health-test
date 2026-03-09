import { useQuizHeaderStore } from "@/stores";
import { useLayoutEffect } from "react";

type Params = {
  onBackPress: () => void;
  hideBackButton?: boolean;
  isBackDisabled: boolean;
  isVisible: boolean;
  progress: number;
};

/**
 * Syncs quiz header state with route-specific controls.
 * Keeps header updates consistent between quiz-flow screens.
 */
export function useQuizHeaderController({
  onBackPress,
  hideBackButton = false,
  isBackDisabled,
  isVisible,
  progress,
}: Params) {
  const setHeaderState = useQuizHeaderStore((s) => s.setState);

  useLayoutEffect(() => {
    setHeaderState({
      onBackPress,
      hideBackButton,
      isBackDisabled,
      isVisible,
      progress,
    });
  }, [setHeaderState, onBackPress, hideBackButton, isBackDisabled, isVisible, progress]);
}
