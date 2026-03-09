import { createSetGlowTarget, useGlowStore } from "@/stores";
import type { ReactNode } from "react";
import { useRef } from "react";
import { useSharedValue } from "react-native-reanimated";

/**
 * Initializes the glow Zustand store with the Reanimated SharedValue.
 * Must be rendered once at app root before any glow consumers.
 */
export function GlowStoreInitializer({ children }: { children: ReactNode }) {
  const glowProgress = useSharedValue(0);
  const didInit = useRef(false);

  if (!didInit.current) {
    didInit.current = true;
    const setGlowVariant = useGlowStore.getState().setGlowVariant;
    const setGlowTarget = createSetGlowTarget(glowProgress, setGlowVariant);
    useGlowStore.getState().initialize(glowProgress, setGlowTarget);
  }

  return <>{children}</>;
}
