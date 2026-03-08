import type { BottomActionConfig } from "@/components/ScreenWithBottomAction";
import { PROGRESS_BAR_COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import type { QuizAnswers } from "@/hooks/useQuizEngine";
import type { SectionSnapshot } from "@/hooks/useQuizSectionSnapshot";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import { useMemo } from "react";

type Params = {
  section: SectionSnapshot;
  answers: QuizAnswers;
  isTransitioning: boolean;
  isWheelPickerShowingBuffer: boolean;
  goNext: () => void;
  startSectionTransition: (action: () => void) => void;
  setSubmitAttempted: (attempted: boolean) => void;
  onSummaryActionPress: () => void;
};

/**
 * Builds the bottom CTA configuration for the quiz screen.
 * Encapsulates label, disabled rules, fill color, and press behavior.
 */
export function useQuizBottomAction({
  section,
  answers,
  isTransitioning,
  isWheelPickerShowingBuffer,
  goNext,
  startSectionTransition,
  setSubmitAttempted,
  onSummaryActionPress,
}: Params): BottomActionConfig | null {
  return useMemo<BottomActionConfig | null>(() => {
    if (section.kind === "summary") {
      return {
        label: locale.summary.labels.startJourney,
        disabled: isTransitioning,
        fillColor: PROGRESS_BAR_COLORS.summary[getSummaryVariant(answers)],
        onPress: onSummaryActionPress,
      };
    }

    if (section.kind === "question") {
      return {
        label: section.isLast ? locale.common.submit : locale.common.next,
        onPress: () => {
          setSubmitAttempted(true);
          if (section.isLast) {
            goNext();
          } else {
            startSectionTransition(goNext);
          }
        },
        disabled:
          section.question.type === "credentials"
            ? false
            : !section.canProceed ||
              ((section.question.type === "age" ||
                section.question.type === "weight") &&
                isWheelPickerShowingBuffer),
      };
    }

    return null;
  }, [
    section,
    answers,
    isTransitioning,
    isWheelPickerShowingBuffer,
    goNext,
    startSectionTransition,
    setSubmitAttempted,
    onSummaryActionPress,
  ]);
}
