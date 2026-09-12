import { useEffect, useRef } from "react";
import { animationCoordinator } from "@/lib/animation-coordinator";

export function useCinematicParallax<T extends HTMLElement>(
  depth: number = 0.5,
  direction: "all" | "x" | "y" = "all",
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    if (!ref.current) return;
    const cleanup = animationCoordinator.registerParallax({
      element: ref.current,
      depth,
      direction,
    });
    return cleanup;
  }, [depth, direction]);

  return ref;
}
