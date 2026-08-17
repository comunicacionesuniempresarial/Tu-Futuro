"use client";

import { type ReactNode } from "react";
import { useReducedMotion } from "@/features/shared/hooks/useReducedMotion";
import { useScrollReveal } from "@/features/shared/hooks/useScrollReveal";

interface NarrativeSectionProps {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}

/**
 * Scroll-reveal section for the landing narrative: stays hidden (opacity +
 * transform only, no layout shift) until it enters the viewport via
 * IntersectionObserver. Under `prefers-reduced-motion` it renders revealed
 * immediately.
 */
export default function NarrativeSection({ id, eyebrow, title, children }: NarrativeSectionProps) {
  const reducedMotion = useReducedMotion();
  const [ref, isVisible] = useScrollReveal<HTMLElement>({ threshold: 0.12 });
  const revealed = reducedMotion || isVisible;

  return (
    <section
      id={id}
      ref={ref}
      aria-labelledby={`${id}-heading`}
      data-revealed={revealed ? "true" : "false"}
      className={`border-b border-[var(--color-border)] py-20 transition-[opacity,transform] duration-700 ease-out will-change-transform lg:py-28 ${
        revealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        <span className="text-sm font-semibold uppercase tracking-widest text-[var(--color-neon-primary)]">
          {eyebrow}
        </span>
        <h2
          id={`${id}-heading`}
          className="font-heading mt-4 max-w-2xl text-4xl font-extrabold tracking-tight lg:text-5xl"
        >
          {title}
        </h2>
        {children}
      </div>
    </section>
  );
}