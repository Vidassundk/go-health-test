import { HomeScreenView } from "@/components/screens/HomeScreenView";
import { locale } from "@/constants/locale";
import { useGlow, useQuizStore } from "@/stores";
import { useScreenTransition } from "@/hooks";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function HomeScreen() {
  const router = useRouter();
  const reset = useQuizStore((s) => s.reset);
  const { setHomeBackgroundEnabled } = useGlow();
  const { isVisible, entering, exiting, fadeOutThen, isTransitioning } = useScreenTransition();
  const { title, text, startOver } = locale.homeScreen;

  useEffect(() => {
    setHomeBackgroundEnabled(true);
  }, [setHomeBackgroundEnabled]);

  const handleStartOver = () => {
    setHomeBackgroundEnabled(false);
    fadeOutThen(() => {
      reset();
      router.replace("/");
    }, "forward");
  };

  return (
    <HomeScreenView
      isVisible={isVisible}
      isTransitioning={isTransitioning}
      entering={entering}
      exiting={exiting}
      title={title}
      text={text}
      startOverLabel={startOver}
      onStartOver={handleStartOver}
    />
  );
}
