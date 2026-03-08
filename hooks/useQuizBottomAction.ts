import type { BottomActionConfig } from "@/components/ScreenWithBottomAction";
import { locale } from "@/constants/locale";
import type { QuizQuestion } from "@/types/quiz";
import { useMemo } from "react";

type Params = {
  currentQuestion: QuizQuestion | null;
  isLast: boolean;
  isCurrentStepValid: boolean;
  isWheelPickerShowingBuffer: boolean;
  goNext: () => void;
  startSectionTransition: (action: () => void) => void;
  setSubmitAttempted: (attempted: boolean) => void;
};

/**
 * Builds the bottom CTA configuration for the quiz screen.
 * Encapsulates label, disabled rules, and press behavior.
 */
export function useQuizBottomAction({
  currentQuestion,
  isLast,
  isCurrentStepValid,
  isWheelPickerShowingBuffer,
  goNext,
  startSectionTransition,
  setSubmitAttempted,
}: Params): BottomActionConfig | null {
  return useMemo<BottomActionConfig | null>(() => {
    if (!currentQuestion) {
      return null;
    }

    return {
      label: isLast ? locale.common.submit : locale.common.next,
      onPress: () => {
        setSubmitAttempted(true);
        if (isLast) {
          goNext();
        } else {
          startSectionTransition(goNext);
        }
      },
      disabled:
        currentQuestion.type === "credentials"
          ? false
          : !isCurrentStepValid ||
            ((currentQuestion.type === "age" || currentQuestion.type === "weight") &&
              isWheelPickerShowingBuffer),
    };
  }, [
    currentQuestion,
    isLast,
    isCurrentStepValid,
    isWheelPickerShowingBuffer,
    goNext,
    startSectionTransition,
    setSubmitAttempted,
  ]);
}
