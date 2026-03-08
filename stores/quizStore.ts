import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type QuizAnswers = Record<string, unknown>;

interface QuizState {
  answers: QuizAnswers;
  currentIndex: number;
  hasStartedJourney: boolean;
  hasHydrated: boolean;
  setAnswer: (key: string, value: unknown) => void;
  clearAnswers: (keys: string[]) => void;
  setCurrentIndex: (index: number | ((prev: number) => number)) => void;
  setHasStartedJourney: (started: boolean) => void;
  setHasHydrated: (hydrated: boolean) => void;
  reset: () => void;
}

const initialState = {
  answers: {} as QuizAnswers,
  currentIndex: 0,
  hasStartedJourney: false,
  hasHydrated: false,
};

/** Selector helpers for granular subscriptions - use these to avoid re-renders when unrelated answers change */
export const selectAnswer = (key: string) => (s: QuizState) => s.answers[key];
export const selectSetCurrentIndex = (s: QuizState) => s.setCurrentIndex;
export const selectCurrentIndex = (s: QuizState) => s.currentIndex;

export const useQuizStore = create<QuizState>()(
  persist(
    (set) => ({
      ...initialState,
      setAnswer: (key, value) =>
        set((state) => ({
          answers: { ...state.answers, [key]: value },
        })),
      // Wipe path-specific answers when switching program (e.g. smoking↔alcohol)
      clearAnswers: (keys) =>
        set((state) => {
          const next = { ...state.answers };
          for (const k of keys) delete next[k];
          return { answers: next };
        }),
      setCurrentIndex: (indexOrUpdater) =>
        set((state) => ({
          currentIndex:
            typeof indexOrUpdater === "function"
              ? indexOrUpdater(state.currentIndex)
              : indexOrUpdater,
        })),
      setHasStartedJourney: (started) => set({ hasStartedJourney: started }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
      reset: () => set((state) => ({ ...initialState, hasHydrated: state.hasHydrated })),
    }),
    {
      name: "quiz-storage",
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
      partialize: (state) => ({
        answers: state.answers,
        currentIndex: state.currentIndex,
        hasStartedJourney: state.hasStartedJourney,
      }),
    }
  )
);
