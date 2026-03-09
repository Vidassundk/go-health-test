import { createSetGlowTarget, useGlowStore } from "@/stores";
import type { ReactNode } from "react";
import React, { useLayoutEffect, useRef } from "react";
import { useSharedValue } from "react-native-reanimated";

/**
 * Initializes the glow Zustand store with the Reanimated SharedValue.
 * Must be rendered once at app root before any glow consumers.
 */
export function GlowStoreInitializer({ children }: { children: ReactNode }) {
  const glowProgress = useSharedValue(0);
  const didInit = useRef(false);
  const isInitialized = useGlowStore((s) => Boolean(s.glowProgress && s.setGlowTarget));

  useLayoutEffect(() => {
    if (didInit.current) return;
    didInit.current = true;
    const setGlowVariant = useGlowStore.getState().setGlowVariant;
    const setGlowTarget = createSetGlowTarget(glowProgress, setGlowVariant);
    useGlowStore.getState().initialize(glowProgress, setGlowTarget);
  }, [glowProgress]);

  if (!isInitialized) return null;

  return <>{children}</>;
}
