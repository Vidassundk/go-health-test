import { FullScreenBuffer, QuizFlowScreenShell, QuizSummary } from "@components";
import { PROGRESS_BAR_COLORS } from "@/constants/colors";
import { locale } from "@/constants/locale";
import { isDebugSkipQuizToSummaryEnabled } from "@/config/featureFlags";
import { useGlow, useQuizStore } from "@/stores";
import { useQuizHeaderController, useQuizQuestions, useScreenTransition } from "@/hooks";
import { getSummaryVariant } from "@/utils/getSummaryVariant";
import { showErrorToast } from "@/components/feedback/toast";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
export default function QuizSummaryScreen() {
  const { questions, isLoading, isError, error } = useQuizQuestions();
  const answers = useQuizStore((s) => s.answers);
  const setHasStartedJourney = useQuizStore((s) => s.setHasStartedJourney);
  const { setGlowTarget } = useGlow();
  const router = useRouter();
  // Keeps header visible while navigating back to quiz so top chrome transitions smoothly.
  const [keepHeaderVisibleOnExit, setKeepHeaderVisibleOnExit] = useState(false);
  const { isVisible, entering, exiting, fadeOutThen, isTransitioning } = useScreenTransition();
  const shouldHideBackArrow = isDebugSkipQuizToSummaryEnabled();

  // Summary visual variant is derived from final answers and reused by glow + CTA color.
  const variant = getSummaryVariant(answers);

  // Ensure summary opens with matching glow variant.
  useEffect(() => {
    setGlowTarget(1, variant);
  }, [setGlowTarget, variant]);

  // Surface query failures as toasts.
  useEffect(() => {
    if (isError && error) {
      showErrorToast(error.message);
    }
  }, [isError, error]);

  // Back from summary returns to quiz and restores neutral glow.
  const handleBackPress = useCallback(() => {
    setGlowTarget(0);
    setKeepHeaderVisibleOnExit(true);
    fadeOutThen(() => router.replace("/health-quiz"), "backward");
  }, [setGlowTarget, fadeOutThen, router]);

  // Final CTA marks journey complete and exits quiz flow to home.
  const handleStartJourney = useCallback(() => {
    setHasStartedJourney(true);
    setGlowTarget(0);
    setKeepHeaderVisibleOnExit(false);
    fadeOutThen(() => router.replace("/home"), "forward");
  }, [setHasStartedJourney, setGlowTarget, fadeOutThen, router]);

  // Quiz-route header state is store-driven so layout stays persistent across flow screens.
  useQuizHeaderController({
    onBackPress: handleBackPress,
    hideBackButton: shouldHideBackArrow,
    isBackDisabled: isTransitioning,
    isVisible: isVisible || keepHeaderVisibleOnExit,
    progress: 1,
  });

  return (
    <QuizFlowScreenShell
      isVisible={isVisible}
      entering={entering}
      exiting={exiting}
      action={{
        label: locale.summary.labels.startJourney,
        disabled: isTransitioning,
        fillColor: PROGRESS_BAR_COLORS.summary[variant],
        onPress: handleStartJourney,
      }}
      isTransitioning={isTransitioning}
    >
      {isLoading || !questions ? <FullScreenBuffer /> : <QuizSummary questions={questions} />}
    </QuizFlowScreenShell>
  );
}
