import { isDebugSkipQuizToSummaryEnabled } from "@/config/featureFlags";
import { LandingScreenView } from "@/components/screens/LandingScreenView";
import { useScreenTransition } from "@/hooks";
import { useQuizStore } from "@/stores";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function LandingScreen() {
  const router = useRouter();
  const hasHydrated = useQuizStore((s) => s.hasHydrated);
  const hasStartedJourney = useQuizStore((s) => s.hasStartedJourney);
  const { isVisible, entering, exiting, fadeOutThen, isTransitioning } = useScreenTransition();
  const shouldSkipQuizToSummary = isDebugSkipQuizToSummaryEnabled();

  useEffect(() => {
    if (hasHydrated && hasStartedJourney) {
      router.replace("/home");
    }
  }, [hasHydrated, hasStartedJourney, router]);

  if (!hasHydrated || hasStartedJourney) {
    return null;
  }

  const handleNext = () =>
    fadeOutThen(
      () => router.replace(shouldSkipQuizToSummary ? "/quiz-summary" : "/health-quiz"),
      "forward"
    );

  return (
    <LandingScreenView
      isVisible={isVisible}
      isTransitioning={isTransitioning}
      entering={entering}
      exiting={exiting}
      onNext={handleNext}
    />
  );
}
