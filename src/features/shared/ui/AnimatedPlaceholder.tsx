"use client";

import { useEffect, useState } from "react";

interface AnimatedPlaceholderProps {
  /** List of placeholder texts to cycle through */
  texts: string[];
  /** Milliseconds each text stays visible */
  interval?: number;
}

/**
 * Animated placeholder that cycles through example texts.
 * Uses CSS class `animated-placeholder` for pulse animation.
 */
export default function AnimatedPlaceholder({
  texts,
  interval = 2200,
}: AnimatedPlaceholderProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (texts.length <= 1) return;
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((prev) => (prev + 1) % texts.length);
        setVisible(true);
      }, 200);
    }, interval);
    return () => clearInterval(timer);
  }, [texts.length, interval]);

  return (
    <span
      aria-hidden="true"
      className={`animated-placeholder pointer-events-none absolute inset-0 flex items-center px-4 text-lg transition-opacity duration-200 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      {texts[index]}
    </span>
  );
}
