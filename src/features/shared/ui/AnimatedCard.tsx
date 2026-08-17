"use client";

import { type ReactNode } from "react";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useScrollReveal } from "../hooks/useScrollReveal";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  /** Optional stagger delay in ms for the entrance transition. */
  delay?: number;
}

/**
 * Card with an IntersectionObserver entrance reveal and a transform-only
 * hover lift. When the user prefers reduced motion, the card is revealed
 * immediately and no animation runs. The reveal state is exposed via
 * `data-revealed` so animations stay pure CSS.
 */
export default function AnimatedCard({ children, className = "", delay = 0 }: AnimatedCardProps) {
  const reducedMotion = useReducedMotion();
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold: 0.1 });
  const revealed = reducedMotion || isVisible;

  return (
    <div
      ref={ref}
      data-revealed={revealed ? "true" : "false"}
      className={`rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-[opacity,transform] duration-500 ease-out will-change-transform hover:-translate-y-1 ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
      style={{ transitionDelay: revealed && delay ? `${delay}ms` : undefined }}
    >
      {children}
    </div>
  );
}