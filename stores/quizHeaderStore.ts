import { create } from "zustand";

type QuizHeaderState = {
  progress: number;
  isBackDisabled: boolean;
  hideBackButton: boolean;
  onBackPress: () => void;
  setState: (next: Partial<Omit<QuizHeaderState, "setState">>) => void;
};

const noop = () => {};

export const useQuizHeaderStore = create<QuizHeaderState>((set) => ({
  progress: 0,
  isBackDisabled: false,
  hideBackButton: false,
  onBackPress: noop,
  setState: (next) =>
    set((state) => {
      const progress = next.progress ?? state.progress;
      const isBackDisabled = next.isBackDisabled ?? state.isBackDisabled;
      const hideBackButton = next.hideBackButton ?? state.hideBackButton;
      const onBackPress = next.onBackPress ?? state.onBackPress;

      if (
        progress === state.progress &&
        isBackDisabled === state.isBackDisabled &&
        hideBackButton === state.hideBackButton &&
        onBackPress === state.onBackPress
      ) {
        return state;
      }

      return {
        ...state,
        progress,
        isBackDisabled,
        hideBackButton,
        onBackPress,
      };
    }),
}));

export const selectQuizHeaderState = (s: QuizHeaderState) => ({
  progress: s.progress,
  isBackDisabled: s.isBackDisabled,
  hideBackButton: s.hideBackButton,
  onBackPress: s.onBackPress,
});
