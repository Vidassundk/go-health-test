import { useEffect, useRef, type RefObject } from "react";

type Focusable = {
  focus: () => void;
};

/**
 * Focuses the given ref when a screen transitions into an interactive state.
 * Matches the existing "focus once after transitioning becomes false" behavior.
 */
export function useFocusOnTransitionEnd<T extends Focusable>(
  targetRef: RefObject<T | null>,
  isTransitioning = false
) {
  const prevTransitioningRef = useRef(true);

  useEffect(() => {
    if (prevTransitioningRef.current && !isTransitioning) {
      prevTransitioningRef.current = false;
      targetRef.current?.focus();
    } else if (isTransitioning) {
      prevTransitioningRef.current = true;
    }
  }, [isTransitioning, targetRef]);
}
