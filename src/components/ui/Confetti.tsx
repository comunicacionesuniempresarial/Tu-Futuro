"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";

interface ConfettiProps {
  active?: boolean;
}

export default function Confetti({ active = true }: ConfettiProps) {
  const hasFired = useRef(false);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!active || hasFired.current || prefersReduced) return;
    hasFired.current = true;

    const duration = 4000;
    const end = Date.now() + duration;

    const colors = ["#00ff88", "#22D3EE", "#ff0080", "#fbbf24", "#00d4ff"];

    let rafId = 0;
    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors,
        gravity: 0.8,
        scalar: 1.2,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors,
        gravity: 0.8,
        scalar: 1.2,
      });

      if (Date.now() < end) {
        rafId = requestAnimationFrame(frame);
      }
    };

    frame();

    return () => cancelAnimationFrame(rafId);
  }, [active, prefersReduced]);

  return null;
}
