"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

/**
 * Fires the victory confetti exactly once per mount, unless the user
 * prefers reduced motion. Renders nothing.
 */
export function ConfettiTrigger() {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;

    const reduceMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion) return;

    firedRef.current = true;
    void confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return null;
}