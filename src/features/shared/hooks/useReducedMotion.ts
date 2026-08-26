"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  const [prefersReduced, setPrefersReduced] = useState(() => {
    // Sync initial state with browser on first render (no SSR mismatch).
    // Server always returns false; client hydrates to the real value.
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    // This is a browser subscription; the initial sync is deliberate so the
    // hook reflects the user's preference immediately after hydration.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPrefersReduced(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setPrefersReduced(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
