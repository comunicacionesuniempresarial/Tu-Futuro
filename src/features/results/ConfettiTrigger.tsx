"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";

/**
 * Fires the victory confetti exactly once per mount, unless the user
 * prefers reduced motion. Renders nothing.
 */
export function ConfettiTrigger() {
  const firedRef = useRef(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (firedRef.current || prefersReduced) return;

    firedRef.current = true;
    void confetti({
      particleCount: 220,
      spread: 110,
      startVelocity: 48,
      gravity: 0.72,
      ticks: 320,
      scalar: 1.15,
      colors: ["#FFE16D", "#22D3EE", "#E879F9", "#FFFFFF"],
      origin: { y: 0.58 },
    });
  }, [prefersReduced]);

  return null;
}
