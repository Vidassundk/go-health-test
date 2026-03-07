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
