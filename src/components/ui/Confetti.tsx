"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface ConfettiProps {
  active?: boolean;
}

export default function Confetti({ active = true }: ConfettiProps) {
  const hasFired = useRef(false);

  useEffect(() => {
    if (!active || hasFired.current) return;
    // Respeta la preferencia del sistema de reducir animaciones
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    hasFired.current = true;

    const colors = ["#00ff88", "#D51933", "#ff0080", "#fbbf24", "#00d4ff"];
    confetti({
        particleCount: 18,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.7 },
        colors,
        gravity: 0.8,
        scalar: 1.2,
    });
    confetti({
        particleCount: 18,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.7 },
        colors,
        gravity: 0.8,
        scalar: 1.2,
    });
  }, [active]);

  return null;
}
