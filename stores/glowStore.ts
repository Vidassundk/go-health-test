import { runOnJS, type SharedValue, withTiming } from "react-native-reanimated";
import { create } from "zustand";

const GLOW_ANIMATION_DURATION_MS = 600;

export type GlowVariant = "smoking" | "drinking";

interface GlowState {
  glowProgress: SharedValue<number> | null;
  glowVariant: GlowVariant | null;
  setGlowTarget: ((target: number, variant?: GlowVariant) => void) | null;
  isHomeBackgroundEnabled: boolean;
  setGlowVariant: (variant: GlowVariant | null) => void;
  setHomeBackgroundEnabled: (enabled: boolean) => void;
  /** Called once by GlowStoreInitializer to inject the SharedValue and setGlowTarget */
  initialize: (
    glowProgress: SharedValue<number>,
    setGlowTarget: (target: number, variant?: GlowVariant) => void
  ) => void;
}

export const useGlowStore = create<GlowState>((set, get) => ({
  glowProgress: null,
  glowVariant: null,
  setGlowTarget: null,
  isHomeBackgroundEnabled: true,
  setGlowVariant: (variant) => set({ glowVariant: variant }),
  setHomeBackgroundEnabled: (enabled) => set({ isHomeBackgroundEnabled: enabled }),
  initialize: (glowProgress, setGlowTarget) => set({ glowProgress, setGlowTarget }),
}));

export function useGlow() {
  const glowProgress = useGlowStore((s) => s.glowProgress);
  const glowVariant = useGlowStore((s) => s.glowVariant);
  const setGlowTarget = useGlowStore((s) => s.setGlowTarget);
  const isHomeBackgroundEnabled = useGlowStore((s) => s.isHomeBackgroundEnabled);
  const setHomeBackgroundEnabled = useGlowStore((s) => s.setHomeBackgroundEnabled);

  if (!glowProgress || !setGlowTarget) {
    throw new Error("useGlow must be used within GlowStoreInitializer");
  }

  return {
    glowProgress,
    glowVariant,
    setGlowTarget,
    isHomeBackgroundEnabled,
    setHomeBackgroundEnabled,
  };
}

export function createSetGlowTarget(
  glowProgress: SharedValue<number>,
  setGlowVariant: (v: GlowVariant | null) => void
): (target: number, variant?: GlowVariant) => void {
  return (target: number, variant?: GlowVariant) => {
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
  };
}
