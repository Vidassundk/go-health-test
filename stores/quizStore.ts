import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type QuizAnswers = Record<string, unknown>;

interface QuizState {
  answers: QuizAnswers;
  currentIndex: number;
  setAnswer: (key: string, value: unknown) => void;
  setCurrentIndex: (index: number | ((prev: number) => number)) => void;
  reset: () => void;
}

const initialState = {
  answers: {} as QuizAnswers,
  currentIndex: 0,
};

/** Selector helpers for granular subscriptions - use these to avoid re-renders when unrelated answers change */
export const selectAnswer = (key: string) => (s: QuizState) => s.answers[key];
export const selectSetAnswer = (s: QuizState) => s.setAnswer;
export const selectSetCurrentIndex = (s: QuizState) => s.setCurrentIndex;
export const selectCurrentIndex = (s: QuizState) => s.currentIndex;
export const selectAnswers = (s: QuizState) => s.answers;

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      ...initialState,
      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),
      setCurrentIndex: (indexOrUpdater) =>
        set((state) => ({
          currentIndex:
            typeof indexOrUpdater === "function"
              ? indexOrUpdater(state.currentIndex)
              : indexOrUpdater,
        })),
      reset: () => set(initialState),
    }),
    {
      name: "quiz-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        answers: state.answers,
        currentIndex: state.currentIndex,
      }),
    }
  )
);
