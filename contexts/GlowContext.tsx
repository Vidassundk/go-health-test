import React, { createContext, useCallback, useContext } from "react";
import {
  runOnJS,
  type SharedValue,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const GLOW_ANIMATION_DURATION_MS = 600;

export type GlowVariant = "smoking" | "drinking";

type GlowContextValue = {
  glowProgress: SharedValue<number>;
  glowVariant: GlowVariant | null;
  setGlowTarget: (target: number, variant?: GlowVariant) => void;
};

const GlowContext = createContext<GlowContextValue | null>(null);

export function GlowProvider({ children }: { children: React.ReactNode }) {
  const glowProgress = useSharedValue(0);
  const [glowVariant, setGlowVariant] = React.useState<GlowVariant | null>(null);

  const setGlowTarget = useCallback(
    (target: number, variant?: GlowVariant) => {
      if (target === 1 && variant) {
        setGlowVariant(variant);
      }
      glowProgress.value = withTiming(
        target,
        { duration: GLOW_ANIMATION_DURATION_MS },
        (finished) => {
          if (finished && target === 0) {
            runOnJS(setGlowVariant)(null);
          }
        }
      );
    },
    [glowProgress]
  );

  return (
    <GlowContext.Provider value={{ glowProgress, glowVariant, setGlowTarget }}>
      {children}
    </GlowContext.Provider>
  );
}

export function useGlowContext(): GlowContextValue {
  const ctx = useContext(GlowContext);
  if (!ctx) {
    throw new Error("useGlowContext must be used within GlowProvider");
  }
  return ctx;
}
