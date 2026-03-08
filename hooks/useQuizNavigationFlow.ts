import type { GlowVariant } from "@/contexts/GlowContext";
import type { QuizAnswers } from "@/hooks/useQuizEngine";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import { useCallback, useEffect } from "react";

type Params = {
  setGlowTarget: (target: number, variant?: GlowVariant) => void;
  startSectionTransition: (action: () => void) => void;
  showSummary: boolean;
  setShowSummary: (show: boolean) => void;
  pendingSubmitAnswers: QuizAnswers | null;
  setPendingSubmitAnswers: (answers: QuizAnswers | null) => void;
  isFirst: boolean;
  goBack: () => void;
  navigateToHome: () => void;
  navigateToIntro: () => void;
};

/**
 * Owns quiz-level navigation side effects:
 * summary reveal after submit, summary/back behavior, and glow reset lifecycle.
 */
export function useQuizNavigationFlow({
  setGlowTarget,
  startSectionTransition,
  showSummary,
  setShowSummary,
  pendingSubmitAnswers,
  setPendingSubmitAnswers,
  isFirst,
  goBack,
  navigateToHome,
  navigateToIntro,
}: Params) {
  const onSummaryActionPress = useCallback(() => {
    setGlowTarget(0);
    navigateToHome();
  }, [setGlowTarget, navigateToHome]);

  const onBackPress = useCallback(() => {
    if (showSummary) {
      setGlowTarget(0);
      startSectionTransition(() => setShowSummary(false));
      return;
    }

    if (isFirst) {
      navigateToIntro();
      return;
    }

    startSectionTransition(goBack);
  }, [
    showSummary,
    setGlowTarget,
    startSectionTransition,
    isFirst,
    navigateToIntro,
    goBack,
  ]);

  useEffect(() => {
    if (!pendingSubmitAnswers) {
      return;
    }

    setGlowTarget(1, getSummaryVariant(pendingSubmitAnswers));
    startSectionTransition(() => setShowSummary(true));
    setPendingSubmitAnswers(null);
  }, [pendingSubmitAnswers, setGlowTarget, startSectionTransition]);

  useEffect(() => {
    return () => setGlowTarget(0);
  }, [setGlowTarget]);

  return {
    onSummaryActionPress,
    onBackPress,
  };
}
