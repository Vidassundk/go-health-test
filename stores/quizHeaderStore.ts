import { create } from "zustand";

type QuizHeaderState = {
  progress: number;
  isBackDisabled: boolean;
  hideBackButton: boolean;
  isVisible: boolean;
  onBackPress: () => void;
  setState: (next: Partial<Omit<QuizHeaderState, "setState">>) => void;
};

const noop = () => {};

export const useQuizHeaderStore = create<QuizHeaderState>((set) => ({
  progress: 0,
  isBackDisabled: false,
  hideBackButton: false,
  isVisible: true,
  onBackPress: noop,
  setState: (next) =>
    set((state) => {
      const progress = next.progress ?? state.progress;
      const isBackDisabled = next.isBackDisabled ?? state.isBackDisabled;
      const hideBackButton = next.hideBackButton ?? state.hideBackButton;
      const isVisible = next.isVisible ?? state.isVisible;
      const onBackPress = next.onBackPress ?? state.onBackPress;

      if (
        progress === state.progress &&
        isBackDisabled === state.isBackDisabled &&
        hideBackButton === state.hideBackButton &&
        isVisible === state.isVisible &&
        onBackPress === state.onBackPress
      ) {
        return state;
      }

      return {
        ...state,
        progress,
        isBackDisabled,
        hideBackButton,
        isVisible,
        onBackPress,
      };
    }),
}));

export const selectQuizHeaderState = (s: QuizHeaderState) => ({
  progress: s.progress,
  isBackDisabled: s.isBackDisabled,
  hideBackButton: s.hideBackButton,
  isVisible: s.isVisible,
  onBackPress: s.onBackPress,
});
